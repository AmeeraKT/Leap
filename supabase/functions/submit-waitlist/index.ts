import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const WAITLIST_YEARS = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth or above",
] as const;

const WAITLIST_DEGREES = ["Bachelor", "Master", "PhD", "Diploma/Other"] as const;

const WAITLIST_MAJORS = [
  "Agriculture / Animal Sciences",
  "Architecture / Design / Urban Planning",
  "Arts / Humanities / Social Sciences",
  "Business / Economics",
  "Computer Science / IT",
  "Education",
  "Engineering",
  "Environment",
  "Health / Psychology / Medicine",
  "Law",
  "Science / Mathematics",
] as const;

const WAITLIST_ONLINE_PRESENCE = [
  "I post regularly",
  "I've posted a few times",
  "I have profiles but never post",
  "I don't have profiles",
] as const;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const serverSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254).transform((e) => e.toLowerCase()),
    year: z.enum(WAITLIST_YEARS),
    degree: z.enum(WAITLIST_DEGREES),
    majors: z
      .array(z.enum(WAITLIST_MAJORS))
      .min(1)
      .max(2)
      .refine((arr) => new Set(arr).size === arr.length),
    university: z
      .string()
      .trim()
      .max(120)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    onlinePresence: z.enum(WAITLIST_ONLINE_PRESENCE),
    website: z.string().optional().default(""),
  })
  .strict();

function json(
  status: number,
  body: Record<string, unknown>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function genericValidationError(
  fields?: Record<string, string>,
): Response {
  return json(400, {
    ok: false,
    error: "Please check your details and try again.",
    ...(fields && Object.keys(fields).length ? { fields } : {}),
  });
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("submit-waitlist missing env");
      return json(500, {
        ok: false,
        error: "Unable to join the waitlist. Please try again.",
      });
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return genericValidationError();
    }

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return genericValidationError();
    }

    // Honeypot: reject silently as a soft success from the bot's POV but mark fail
    const website = (raw as { website?: unknown }).website;
    if (typeof website === "string" && website.trim().length > 0) {
      return genericValidationError();
    }

    const parsed = serverSchema.safeParse(raw);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fields[key]) {
          fields[key] = "Invalid value.";
        }
      }
      return genericValidationError(fields);
    }

    const data = parsed.data;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const ipHash = await hashIp(clientIp(req));
    const now = Date.now();
    const { data: rateRow, error: rateReadError } = await supabase
      .from("waitlist_rate_limits")
      .select("ip_hash, window_start, request_count")
      .eq("ip_hash", ipHash)
      .maybeSingle();

    if (rateReadError) {
      console.error("rate limit read failed", rateReadError);
      return json(500, {
        ok: false,
        error: "Unable to join the waitlist. Please try again.",
      });
    }

    const windowStart = rateRow?.window_start
      ? new Date(rateRow.window_start).getTime()
      : 0;
    const inWindow = windowStart > 0 && now - windowStart < RATE_LIMIT_WINDOW_MS;
    const count = inWindow ? (rateRow?.request_count ?? 0) : 0;

    if (inWindow && count >= RATE_LIMIT_MAX) {
      return json(429, {
        ok: false,
        error: "Too many requests. Please try again later.",
      });
    }

    const nextCount = count + 1;
    const nextWindowStart = inWindow
      ? new Date(windowStart).toISOString()
      : new Date(now).toISOString();

    const { error: rateWriteError } = await supabase
      .from("waitlist_rate_limits")
      .upsert(
        {
          ip_hash: ipHash,
          window_start: nextWindowStart,
          request_count: nextCount,
        },
        { onConflict: "ip_hash" },
      );

    if (rateWriteError) {
      console.error("rate limit write failed", rateWriteError);
      return json(500, {
        ok: false,
        error: "Unable to join the waitlist. Please try again.",
      });
    }

    const { error: insertError } = await supabase.from("waitlist_signups").insert({
      name: data.name,
      email: data.email,
      year: data.year,
      degree: data.degree,
      majors: data.majors,
      university: data.university,
      online_presence: data.onlinePresence,
    });

    if (insertError) {
      console.error("waitlist insert failed", insertError);
      if (insertError.code === "23505") {
        return json(409, {
          ok: false,
          error: "This email is already on the waitlist.",
          fields: { email: "This email is already on the waitlist." },
        });
      }
      return json(500, {
        ok: false,
        error: "Unable to join the waitlist. Please try again.",
      });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("submit-waitlist error", err);
    return json(500, {
      ok: false,
      error: "Unable to join the waitlist. Please try again.",
    });
  }
});
