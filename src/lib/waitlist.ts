import { z } from "zod";

export const WAITLIST_YEARS = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth or above",
] as const;

export const WAITLIST_DEGREES = ["Bachelor", "Master", "PhD"] as const;

export const WAITLIST_MAJORS = [
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

export const WAITLIST_ONLINE_PRESENCE = [
  "I post regularly",
  "I've posted a few times",
  "I have profiles but never post",
  "I don't have profiles",
] as const;

export type WaitlistYear = (typeof WAITLIST_YEARS)[number];
export type WaitlistDegree = (typeof WAITLIST_DEGREES)[number];
export type WaitlistMajor = (typeof WAITLIST_MAJORS)[number];
export type WaitlistOnlinePresence = (typeof WAITLIST_ONLINE_PRESENCE)[number];

export type WaitlistPayload = {
  name: string;
  email: string;
  year: WaitlistYear;
  degree: WaitlistDegree;
  majors: WaitlistMajor[];
  university: string | null;
  onlinePresence: WaitlistOnlinePresence | null;
  website: string;
};

export type WaitlistFieldErrors = Partial<Record<keyof WaitlistPayload | "form", string>>;

export const waitlistPayloadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email is too long."),
    year: z.enum(WAITLIST_YEARS, {
      errorMap: () => ({ message: "Select your year of study." }),
    }),
    degree: z.enum(WAITLIST_DEGREES, {
      errorMap: () => ({ message: "Select your degree." }),
    }),
    majors: z
      .array(z.enum(WAITLIST_MAJORS))
      .min(1, "Select at least 1 major.")
      .max(2, "Select at most 2 majors.")
      .refine((arr) => new Set(arr).size === arr.length, {
        message: "Duplicate majors are not allowed.",
      }),
    university: z.string().trim().max(120, "University must be at most 120 characters.").nullish(),
    onlinePresence: z
      .union([z.enum(WAITLIST_ONLINE_PRESENCE), z.literal(""), z.null()])
      .optional(),
    website: z.string().max(200).optional(),
  })
  .strict();

function normalizePayload(
  data: z.infer<typeof waitlistPayloadSchema>,
): WaitlistPayload {
  const university =
    data.university && data.university.length > 0 ? data.university : null;
  const onlinePresence =
    data.onlinePresence && data.onlinePresence.length > 0
      ? data.onlinePresence
      : null;

  return {
    name: data.name,
    email: data.email,
    year: data.year,
    degree: data.degree,
    majors: data.majors,
    university,
    onlinePresence,
    website: data.website ?? "",
  };
}

export function validateWaitlistClient(
  data: unknown,
): { ok: true; data: WaitlistPayload } | { ok: false; fields: WaitlistFieldErrors } {
  const parsed = waitlistPayloadSchema.safeParse(data);
  if (!parsed.success) {
    const fields: WaitlistFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as keyof WaitlistPayload | undefined) ?? "form";
      if (!fields[key]) fields[key] = issue.message;
    }
    return { ok: false, fields };
  }

  return { ok: true, data: normalizePayload(parsed.data) };
}

export type WaitlistSubmitResult =
  | { ok: true }
  | { ok: false; error: string; fields?: WaitlistFieldErrors };

export async function submitWaitlist(
  payload: WaitlistPayload,
): Promise<WaitlistSubmitResult> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    return {
      ok: false,
      error: "Waitlist is not configured. Please try again later.",
    };
  }

  const response = await fetch(`${baseUrl}/functions/v1/submit-waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
    body: JSON.stringify(payload),
  });

  let body: {
    ok?: boolean;
    error?: string;
    fields?: WaitlistFieldErrors;
  } = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (response.ok && body.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    error: body.error || "Unable to join the waitlist. Please try again.",
    fields: body.fields,
  };
}
