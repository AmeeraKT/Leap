import type { Experience } from "@/lib/experiences-store";
import type { ProgressionState } from "@/lib/progression-store";
import { xpProgressInLevel } from "@/lib/progression-store";

export interface GamificationNudge {
  id: string;
  message: string;
  ctaLabel: string;
  to: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export function getWeeklyLogs(state: ProgressionState): number {
  const key = currentWeekKey();
  if (state.weeklyLogWeekKey !== key) return 0;
  return state.weeklyLogCount;
}

export function getGamificationNudge(
  state: ProgressionState,
  experiences: Experience[],
): GamificationNudge | null {
  const unshared = experiences.find((e) => !Object.values(e.posted).some(Boolean));
  if (unshared) {
    return {
      id: "unshared",
      message: `You logged "${unshared.title}" but haven't shared it yet. Want me to draft a post?`,
      ctaLabel: "Draft it",
      to: `/journey/${unshared.id}`,
    };
  }

  if (state.lastActiveDate !== todayIso() && state.streakDays > 0) {
    return {
      id: "streak-risk",
      message: `Your ${state.streakDays}-day streak is on the line — complete one task today to keep hopping!`,
      ctaLabel: "Open roadmap",
      to: "/roadmap",
    };
  }

  const weeklyLogs = getWeeklyLogs(state);
  if (weeklyLogs < 1) {
    return {
      id: "weekly-goal",
      message: "Weekly goal: log at least one experience. A small win counts!",
      ctaLabel: "Log experience",
      to: "/journey/new",
    };
  }

  const levelProgress = xpProgressInLevel(state.xp);
  if (levelProgress.percent >= 80) {
    return {
      id: "near-level",
      message: `You're ${levelProgress.needed - levelProgress.current} XP from the next level. One more push!`,
      ctaLabel: "See progress",
      to: "/about-me",
    };
  }

  if (experiences.length >= 3 && experiences.length < 5) {
    return {
      id: "documentarian-close",
      message: `You're ${5 - experiences.length} experiences away from the Documentarian badge.`,
      ctaLabel: "Add one",
      to: "/journey/new",
    };
  }

  return {
    id: "default",
    message: "I can draft your personal statement or compare scholarships in seconds.",
    ctaLabel: "Chat now",
    to: "/chat",
  };
}
