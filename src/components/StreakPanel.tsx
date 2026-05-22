import { Flame, Snowflake, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWeeklyLogs } from "@/lib/gamification-nudges";
import { progressionStore, useProgression } from "@/lib/progression-store";

const WEEKLY_GOAL = 1;

export const StreakPanel = () => {
  const state = useProgression();
  const weeklyLogs = getWeeklyLogs(state);
  const weeklyPercent = Math.min(100, (weeklyLogs / WEEKLY_GOAL) * 100);
  const freezeAvailable =
    state.streakFreezeMonth !== new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-coral/50 bg-coral/10 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-coral">
          <Flame className="h-4 w-4" /> Daily streak
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-4xl font-black text-foreground">{state.streakDays}</span>
          <span className="text-sm font-bold text-muted-foreground">days in a row</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Log wins, finish tasks, or share content today to keep your streak alive.
        </p>
        {freezeAvailable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full rounded-full text-xs font-bold"
            onClick={() => progressionStore.useStreakFreeze()}
          >
            <Snowflake className="mr-1 h-3.5 w-3.5" /> Use streak freeze (1× this month)
          </Button>
        )}
      </div>

      <div className="rounded-3xl border-2 border-border bg-surface p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Target className="h-3 w-3" /> Weekly goal
        </div>
        <div className="mt-2 font-display text-2xl font-black">
          {weeklyLogs} / {WEEKLY_GOAL}
        </div>
        <div className="text-xs text-muted-foreground">experiences logged this week</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-secondary" style={{ width: `${weeklyPercent}%` }} />
        </div>
      </div>
    </div>
  );
};
