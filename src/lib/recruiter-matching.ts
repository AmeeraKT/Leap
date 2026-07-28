import type { Student } from "@/data/students";

const tokenize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

function yearHints(tokens: string[]): number[] {
  const years: number[] = [];
  const yearMap: Record<string, number> = {
    "1st": 1,
    "first": 1,
    "2nd": 2,
    "second": 2,
    "3rd": 3,
    "third": 3,
    "4th": 4,
    "fourth": 4,
  };
  for (const token of tokens) {
    if (token in yearMap) years.push(yearMap[token]);
    const num = Number(token);
    if ([1, 2, 3, 4].includes(num)) years.push(num);
  }
  return [...new Set(years)];
}

export function matchStudents(students: Student[], query: string): Student[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hintedYears = yearHints(tokens);

  const scored = students
    .map((student) => {
      let score = 0;
      const hay = [
        student.oneLiner,
        student.degree,
        student.university,
        ...student.majors,
        ...student.skills,
      ]
        .join(" ")
        .toLowerCase();

      for (const token of tokens) {
        if (hay.includes(token)) score += 2;
        if (student.skills.some((s) => s.toLowerCase().includes(token))) score += 3;
        if (student.majors.some((m) => m.toLowerCase().includes(token))) score += 3;
      }

      if (hintedYears.length > 0 && hintedYears.includes(student.year)) score += 4;
      if (tokens.some((t) => ["startup", "founder"].includes(t)) && student.hasStartup) score += 4;
      if (
        tokens.some((t) => ["project", "projects", "portfolio", "shipped"].includes(t)) &&
        student.hasProjects
      ) {
        score += 4;
      }

      return { student, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.student.name.localeCompare(b.student.name));

  return scored.map((x) => x.student).slice(0, 8);
}

