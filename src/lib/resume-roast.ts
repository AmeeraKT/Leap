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
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      const criteria = normalizeCriteria(parsed.criteria ?? parsed.criterionScores);
      const skills = normalizeSkills(parsed.skills ?? parsed.skillScores);
      const overallScore = clampScore(
        parsed.overallScore ?? parsed.overall ?? Math.round(criteria.reduce((s, c) => s + c.score, 0) / criteria.length),
      );
      const roast =
        typeof parsed.roast === "string"
          ? parsed.roast
          : typeof parsed.roastText === "string"
            ? parsed.roastText
            : trimmed;
      return { roast, criteria, skills, overallScore };
    } catch {
      /* fall through to plain-text roast */
    }
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

  return { roast: trimmed, criteria, skills, overallScore };
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

  return parseRoastResponse(
    JSON.stringify({
      roast,
      overallScore: 54,
      criteria: DEFAULT_CRITERIA,
      skills: DEFAULT_SKILLS,
    }),
  );
}

export const RESUME_ROAST_SYSTEM_PROMPT = `You are the AI Resume Roaster — a brutally honest, hilariously savage career critic.

Analyze the resume and respond with ONLY valid JSON (no markdown fences) using this exact shape:
{
  "roast": "3-4 witty roast paragraphs as plain text, then a section titled '🔥 Redemption Arc (Fix These):' with exactly 3 bullet tips starting with •",
  "overallScore": 0-100,
  "criteria": [
    { "name": "Formatting", "score": 0-100 },
    { "name": "Impact & Metrics", "score": 0-100 },
    { "name": "Clarity", "score": 0-100 },
    { "name": "ATS Optimization", "score": 0-100 },
    { "name": "Experience Depth", "score": 0-100 },
    { "name": "Professional Brand", "score": 0-100 }
  ],
  "skills": [
    { "name": "skill name inferred from resume", "level": 0-100 }
  ]
}

Include 6-8 skills you infer from the resume (technical and soft). Score honestly based on evidence in the document.`;
