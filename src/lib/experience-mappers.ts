import type { JourneyEntry } from "@/data/students";
import type { Experience } from "@/lib/experiences-store";

const journeyTypeFromExperience = (type: Experience["type"]): JourneyEntry["type"] => {
  if (type === "Workshop") return "Event";
  return type;
};

/** Best-effort ISO date for recruiter timeline sorting. */
export const parseExperienceDate = (date: string): string => {
  const primary = date.split(/[–-]/)[0]?.trim() ?? date;
  const parsed = Date.parse(primary);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  return new Date().toISOString();
};

export const experienceToJourneyEntry = (exp: Experience): JourneyEntry => ({
  type: journeyTypeFromExperience(exp.type),
  title: exp.title,
  date: parseExperienceDate(exp.date),
  photo: exp.photoUrl ?? `https://placehold.co/240x240/png?text=${encodeURIComponent(exp.title.slice(0, 12))}`,
  reflection: exp.reflection,
  skills: exp.skills,
});
