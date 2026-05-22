import type { Experience } from "@/lib/experiences-store";
import type { ProgressionState } from "@/lib/progression-store";
import { progressionStore } from "@/lib/progression-store";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_hop", title: "First Hop", description: "Complete the Leap sign-up quiz", emoji: "🐸" },
  { id: "documentarian", title: "Documentarian", description: "Log 5+ journey experiences", emoji: "📝" },
  { id: "amplifier", title: "Amplifier", description: "Share one win on 2+ platforms", emoji: "📣" },
  { id: "consistency_frog", title: "Consistency Frog", description: "Post content 2+ times", emoji: "🔄" },
  { id: "networker", title: "Networker", description: "Log an experience with 3+ contacts", emoji: "🤝" },
  { id: "task_master", title: "Task Master", description: "Complete 10 roadmap or checklist tasks", emoji: "✅" },
  { id: "streak_starter", title: "Streak Starter", description: "Reach a 3-day activity streak", emoji: "🔥" },
  { id: "brand_builder", title: "Brand Builder", description: "Complete 3 personal brand milestones", emoji: "⭐" },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

function countPosted(experiences: Experience[]): number {
  return experiences.reduce((n, e) => n + Object.values(e.posted).filter(Boolean).length, 0);
}

function countTasksDone(state: ProgressionState): number {
  return Object.values(state.roadmapTaskState).filter(Boolean).length;
}

function countBrandMilestones(state: ProgressionState): number {
  return Object.keys(state.roadmapTaskState).filter((k) => k.startsWith("brand-") && state.roadmapTaskState[k]).length;
}

export function getAchievementProgress(
  id: string,
  state: ProgressionState,
  experiences: Experience[],
): { met: boolean; detail: string } {
  switch (id) {
    case "first_hop":
      return { met: Boolean(state.xpGrants.quiz_complete), detail: state.xpGrants.quiz_complete ? "Done" : "Finish sign-up" };
    case "documentarian":
      return { met: experiences.length >= 5, detail: `${experiences.length}/5 logged` };
    case "amplifier": {
      const met = experiences.some((e) => Object.values(e.posted).filter(Boolean).length >= 2);
      return { met, detail: met ? "Multi-platform share" : "Share on 2+ platforms" };
    }
    case "consistency_frog": {
      const posts = countPosted(experiences);
      return { met: posts >= 2, detail: `${posts}/2 posts` };
    }
    case "networker": {
      const met = experiences.some((e) => e.peopleMet.length >= 3);
      return { met, detail: met ? "Big network day" : "Log 3+ contacts" };
    }
    case "task_master": {
      const done = countTasksDone(state);
      return { met: done >= 10, detail: `${done}/10 tasks` };
    }
    case "streak_starter":
      return { met: state.streakDays >= 3, detail: `${state.streakDays}/3 days` };
    case "brand_builder": {
      const done = countBrandMilestones(state);
      return { met: done >= 3, detail: `${done}/3 milestones` };
    }
    default:
      return { met: false, detail: "" };
  }
}

/** Unlock any newly earned achievements; returns ids unlocked this run */
export function evaluateAchievements(
  experiences: Experience[],
  options?: { silent?: boolean },
): string[] {
  const state = progressionStore.get();
  const unlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (state.achievementsUnlocked.includes(achievement.id)) continue;
    const { met } = getAchievementProgress(achievement.id, state, experiences);
    if (met) {
      progressionStore.unlockAchievement(achievement.id, {
        title: achievement.title,
        emoji: achievement.emoji,
        silent: options?.silent,
      });
      unlocked.push(achievement.id);
    }
  }

  return unlocked;
}
