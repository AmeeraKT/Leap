export interface ResumeCriterionScore {
  name: string;
  score: number;
}

export interface ResumeSkillScore {
  name: string;
  level: number;
}

export interface ResumeRoastAnalysis {
  roast: string;
  criteria: ResumeCriterionScore[];
  skills: ResumeSkillScore[];
  overallScore: number;
}

const DEFAULT_CRITERIA: ResumeCriterionScore[] = [
  { name: "Formatting", score: 62 },
  { name: "Impact & Metrics", score: 48 },
  { name: "Clarity", score: 71 },
  { name: "ATS Optimization", score: 55 },
  { name: "Experience Depth", score: 58 },
  { name: "Professional Brand", score: 44 },
];

const DEFAULT_SKILLS: ResumeSkillScore[] = [
  { name: "Communication", level: 72 },
  { name: "Technical Stack", level: 51 },
  { name: "Leadership", level: 38 },
  { name: "Project Delivery", level: 55 },
  { name: "Problem Solving", level: 64 },
  { name: "Industry Tools", level: 42 },
];

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeCriteria(raw: unknown): ResumeCriterionScore[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_CRITERIA;
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = String(row.name ?? row.label ?? "").trim();
      const score = clampScore(row.score ?? row.rating ?? row.value);
      if (!name) return null;
      return { name, score };
    })
    .filter((x): x is ResumeCriterionScore => x !== null);
  return items.length ? items.slice(0, 8) : DEFAULT_CRITERIA;
}

function stripMarkdownFences(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function tryParseJsonObject(raw: string): Record<string, unknown> | null {
  const cleaned = stripMarkdownFences(raw);
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* continue */
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* continue */
    }
  }

  return null;
}

function unescapeRoastText(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\*\*/g, "")
    .trim();
}

function formatRoastParagraphs(parsed: Record<string, unknown>): string | null {
  const paragraphSources = [
    parsed.roastParagraphs,
    parsed.paragraphs,
    parsed.roast_paragraphs,
  ];

  for (const source of paragraphSources) {
    if (!Array.isArray(source) || source.length === 0) continue;
    const paragraphs = source.map((p) => unescapeRoastText(String(p))).filter(Boolean);
    const tipsRaw =
      parsed.redemptionTips ?? parsed.redemption_tips ?? parsed.tips ?? parsed.fixes;
    const tips = Array.isArray(tipsRaw)
      ? tipsRaw.map((t) => unescapeRoastText(String(t)).replace(/^•\s*/, "")).filter(Boolean)
      : [];

    let out = paragraphs.join("\n\n");
    if (tips.length > 0) {
      out += `\n\n🔥 Redemption Arc (Fix These):\n${tips.map((t) => `• ${t}`).join("\n")}`;
    }
    return out;
  }

  return null;
}

function extractRoastText(parsed: Record<string, unknown>, fallback: string): string {
  const fromParagraphs = formatRoastParagraphs(parsed);
  if (fromParagraphs) return fromParagraphs;

  const candidates = [parsed.roast, parsed.roastText, parsed.feedback, parsed.analysis, parsed.summary];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      const text = unescapeRoastText(candidate);
      if (text.startsWith("{")) {
        const nested = tryParseJsonObject(text);
        if (nested) {
          const nestedRoast = formatRoastParagraphs(nested) ?? extractRoastText(nested, "");
          if (nestedRoast) return nestedRoast;
        }
      }
      if (!looksLikeRawJson(text)) return text;
    }
  }

  if (looksLikeRawJson(fallback)) {
    return "We got a structured analysis but couldn't format the roast text. Check the charts below — then try roasting again.";
  }

  return unescapeRoastText(fallback);
}

function looksLikeRawJson(text: string): boolean {
  const t = text.trim();
  return t.startsWith("{") && t.includes('"criteria"');
}

function normalizeSkills(raw: unknown): ResumeSkillScore[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_SKILLS;
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = String(row.name ?? row.skill ?? "").trim();
      const level = clampScore(row.level ?? row.score ?? row.proficiency);
      if (!name) return null;
      return { name, level };
    })
    .filter((x): x is ResumeSkillScore => x !== null);
  return items.length ? items.slice(0, 10) : DEFAULT_SKILLS;
}

export function parseRoastResponse(raw: string): ResumeRoastAnalysis {
  const trimmed = stripMarkdownFences(raw);
  const parsed = tryParseJsonObject(trimmed);

  if (parsed) {
    const criteria = normalizeCriteria(parsed.criteria ?? parsed.criterionScores);
    const skills = normalizeSkills(parsed.skills ?? parsed.skillScores);
    const overallScore = clampScore(
      parsed.overallScore ??
        parsed.overall ??
        Math.round(criteria.reduce((s, c) => s + c.score, 0) / criteria.length),
    );
    const roast = extractRoastText(parsed, trimmed);
    return { roast, criteria, skills, overallScore };
  }

  const criteria = DEFAULT_CRITERIA.map((c) => ({
    ...c,
    score: clampScore(c.score + (trimmed.length % 17) - 8),
  }));
  const skills = DEFAULT_SKILLS.map((s) => ({
    ...s,
    level: clampScore(s.level + (trimmed.length % 13) - 6),
  }));
  const overallScore = clampScore(
    Math.round(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length),
  );

  return { roast: unescapeRoastText(trimmed), criteria, skills, overallScore };
}

export function buildFallbackRoast(fileName: string): ResumeRoastAnalysis {
  const roast = `🔥 **Roasting: ${fileName}** 🔥

Oh wow, where do I even begin? Your "Objective" statement reads like it was written in 2003 and left to marinate in mediocrity. "Seeking a challenging role to grow my skills" — congratulations, you've described every human on the planet.

Your skills section lists Microsoft Word and Google Docs. Bold strategy listing software your grandmother has used since 1998. Recruiters are absolutely electrified by that level of innovation.

Those 4-month internships look less like a career trajectory and more like someone who gets bored easily. The gaps between them are doing a lot of heavy lifting.

No LinkedIn, no GitHub, no portfolio? In 2025? We might as well have found this resume in a time capsule.

🔥 Redemption Arc (Fix These):
• Replace your Objective with a punchy 2-line Professional Summary tailored to the role.
• Add quantified achievements — "Increased conversion by 23%" beats "Helped with marketing tasks".
• Link your GitHub, portfolio, or LinkedIn — let the work do the talking.`;

  const paragraphs = roast
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("🔥 Redemption"));
  const redemptionBlock = roast.split("🔥 Redemption Arc")[1] ?? "";
  const tips = redemptionBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("•"))
    .map((l) => l.replace(/^•\s*/, ""));

  return parseRoastResponse(
    JSON.stringify({
      roastParagraphs: paragraphs.slice(0, 4),
      redemptionTips: tips.length ? tips : ["Add quantified wins", "Tighten your summary", "Link portfolio work"],
      overallScore: 54,
      criteria: DEFAULT_CRITERIA,
      skills: DEFAULT_SKILLS,
    }),
  );
}

export const RESUME_ROAST_SYSTEM_PROMPT = `You are the AI Resume Roaster — a brutally honest, hilariously savage career critic.

Return ONLY valid JSON (no markdown code fences, no commentary outside JSON) with this exact shape:
{
  "roastParagraphs": [
    "First roast paragraph as plain prose.",
    "Second roast paragraph.",
    "Third roast paragraph."
  ],
  "redemptionTips": [
    "First fix tip",
    "Second fix tip",
    "Third fix tip"
  ],
  "overallScore": 0,
  "criteria": [
    { "name": "Formatting", "score": 0 },
    { "name": "Impact & Metrics", "score": 0 },
    { "name": "Clarity", "score": 0 },
    { "name": "ATS Optimization", "score": 0 },
    { "name": "Experience Depth", "score": 0 },
    { "name": "Professional Brand", "score": 0 }
  ],
  "skills": [
    { "name": "skill name", "level": 0 }
  ]
}

Rules:
- roastParagraphs must be 3-4 separate strings of witty roast prose (NOT JSON, NOT bullet lists).
- redemptionTips must be exactly 3 short actionable strings (no bullet prefix).
- overallScore and all scores are integers 0-100.
- Include 6-8 skills inferred from the resume.`;
