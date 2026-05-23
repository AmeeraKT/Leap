import { ACHIEVEMENTS, getAchievementProgress } from "@/lib/achievements";
import { useExperiences } from "@/lib/experiences-store";
import { useProgression } from "@/lib/progression-store";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
}

export const AchievementBadges = ({ compact }: Props) => {
  const progression = useProgression();
  const experiences = useExperiences();

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4")}>
      {ACHIEVEMENTS.map((a) => {
        const unlocked = progression.achievementsUnlocked.includes(a.id);
        const { detail } = getAchievementProgress(a.id, progression, experiences);
        return (
          <div
            key={a.id}
            className={cn(
              "rounded-2xl border p-3 transition-colors",
              unlocked
                ? "border-secondary bg-secondary/15"
                : "border-border bg-background opacity-80",
            )}
            title={a.description}
          >
            <div className="text-2xl">{unlocked ? a.emoji : "🔒"}</div>
            <div className="mt-1 font-display text-xs font-normal leading-tight">{a.title}</div>
            {!compact && (
              <div className="mt-0.5 text-[10px] text-muted-foreground">{unlocked ? a.description : detail}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
