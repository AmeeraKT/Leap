import { useMemo } from "react";
import { Sparkles, Star, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/lib/roadmap-store";
import { ROADMAP_PHASE_ORDER } from "@/lib/roadmap-alumni";

const PHASE_META: Record<
  string,
  {
    emoji: string;
    subtitle: string;
    nodeBg: string;
    cardBg: string;
    accent: string;
  }
> = {
  "Phase 1: Exploration": {
    emoji: "01",
    subtitle: "Stage 1",
    nodeBg: "bg-brand-deep text-white",
    cardBg: "bg-surface",
    accent: "border-brand-deep/30",
  },
  "Phase 2: Building": {
    emoji: "02",
    subtitle: "Stage 2",
    nodeBg: "bg-primary text-primary-foreground",
    cardBg: "bg-soft-stone",
    accent: "border-border",
  },
  "Phase 3: Launching": {
    emoji: "03",
    subtitle: "Stage 3",
    nodeBg: "bg-brand-navy text-white",
    cardBg: "bg-pale-blue",
    accent: "border-brand-navy/20",
  },
  "Phase 4: Connecting": {
    emoji: "04",
    subtitle: "Stage 4",
    nodeBg: "bg-brand-deep text-white",
    cardBg: "bg-surface",
    accent: "border-brand-deep/30",
  },
  "Phase 5: Mastering": {
    emoji: "05",
    subtitle: "Stage 5",
    nodeBg: "bg-primary text-primary-foreground",
    cardBg: "bg-soft-stone",
    accent: "border-border",
  },
  "Phase 6: Leading": {
    emoji: "06",
    subtitle: "Stage 6",
    nodeBg: "bg-brand-navy text-white",
    cardBg: "bg-pale-green",
    accent: "border-brand-navy/20",
  },
};

const DEFAULT_META = {
  emoji: "•",
  subtitle: "Stage",
  nodeBg: "bg-muted text-foreground",
  cardBg: "bg-surface",
  accent: "border-border",
};

interface PhaseGroup {
  name: string;
  milestones: Milestone[];
  doneCount: number;
  total: number;
  index: number;
}

interface MilestoneGamePathProps {
  milestones: Milestone[];
  onToggle: (id: string, done?: boolean) => void;
}

export function MilestoneGamePath({ milestones, onToggle }: MilestoneGamePathProps) {
  const phases = useMemo(() => {
    const extraPhases = [...new Set(milestones.map((m) => m.phase))].filter(
      (p) => !ROADMAP_PHASE_ORDER.includes(p as (typeof ROADMAP_PHASE_ORDER)[number]),
    );
    const order = [...ROADMAP_PHASE_ORDER, ...extraPhases];

    return order.map((name, index) => {
      const phaseMilestones = milestones.filter((m) => m.phase === name);
      const doneCount = phaseMilestones.filter((m) => m.done).length;
      return {
        name,
        milestones: phaseMilestones,
        doneCount,
        total: phaseMilestones.length,
        index,
      } satisfies PhaseGroup;
    });
  }, [milestones]);

  const totalDone = milestones.filter((m) => m.done).length;
  const totalCount = milestones.length;
  const overallPercent = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0;
  const activePhaseIndex = phases.findIndex((p) => p.doneCount < p.total);
  const allComplete = activePhaseIndex === -1;

  const pathWidth = 120 + phases.length * 300 + 120;

  return (
    <div className="leap-card relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-7">
        <div>
          <p className="font-display text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Roadmap journey
          </p>
          <h3 className="font-display text-xl font-normal text-foreground md:text-2xl">
            Six stages to your career goals
          </h3>
        </div>
        <div className="rounded-md border border-border bg-surface px-4 py-2 text-center">
          <div className="font-display text-2xl font-normal text-foreground">{overallPercent}%</div>
          <div className="text-xs font-medium uppercase text-muted-foreground">
            {totalDone}/{totalCount} complete
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div
          className="relative mx-auto flex min-h-[380px] items-center px-6 py-8 md:px-10"
          style={{ minWidth: pathWidth }}
        >
          <div
            className="pointer-events-none absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-border"
            aria-hidden
          />

          <div className="relative z-10 mr-4 flex shrink-0 flex-col items-center gap-1">
            <div className="leap-chip-coral rounded-pill px-3 py-1.5 font-display text-xs font-medium uppercase">
              Start
            </div>
          </div>

          {phases.map((phase) => {
            const meta = PHASE_META[phase.name] ?? DEFAULT_META;
            const isComplete = phase.doneCount === phase.total && phase.total > 0;
            const isActive = phase.index === activePhaseIndex;
            const cardAbove = phase.index % 2 === 0;
            const progressPercent =
              phase.total > 0 ? Math.round((phase.doneCount / phase.total) * 100) : 0;

            return (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phase.index * 0.06, duration: 0.35 }}
                className="relative z-10 mx-2 flex w-[min(280px,72vw)] shrink-0 flex-col items-center md:w-[300px]"
              >
                <div className={cn("w-full", cardAbove ? "order-1 mb-3" : "order-3 mt-3")}>
                  <div
                    className={cn(
                      "rounded-lg border p-3.5",
                      meta.cardBg,
                      meta.accent,
                      isActive && "ring-2 ring-brand-coral/40 ring-offset-2",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {meta.subtitle}
                        </p>
                        <h4 className="font-display text-base font-normal leading-tight text-foreground">
                          {phase.name.replace(/^Phase \d+: /, "")}
                        </h4>
                      </div>
                      <span
                        className={cn(
                          "rounded-pill border border-border px-2 py-0.5 font-display text-xs font-medium",
                          isComplete ? "bg-pale-green text-foreground" : "bg-card text-muted-foreground",
                        )}
                      >
                        {phase.doneCount}/{phase.total}
                      </span>
                    </div>

                    <div className="mb-2 h-1.5 overflow-hidden rounded-pill bg-muted">
                      <motion.div
                        className="h-full rounded-pill bg-coral"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>

                    <ul className="max-h-36 space-y-1.5 overflow-y-auto pr-0.5">
                      {phase.milestones.map((m) => (
                        <li
                          key={m.id}
                          onClick={() => onToggle(m.id)}
                          className={cn(
                            "flex cursor-pointer items-start gap-2 rounded-md border border-border bg-card p-2.5 transition-colors hover:bg-muted/50",
                            m.done && "opacity-70",
                          )}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={m.done}
                              onCheckedChange={(v) => onToggle(m.id, v === true)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-sm font-medium leading-snug text-foreground",
                                m.done && "line-through opacity-60",
                              )}
                            >
                              {m.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{m.desc}</span>
                          </div>
                          {m.aiSuggested && (
                            <span className="leap-chip-coral shrink-0 px-1.5 py-0.5 text-[10px] font-medium">
                              <Sparkles className="inline h-2.5 w-2.5" /> AI
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="order-2 flex flex-col items-center">
                  <div
                    className={cn(
                      "relative flex h-14 w-14 flex-col items-center justify-center rounded-full font-display text-sm font-medium",
                      meta.nodeBg,
                      isActive && "ring-2 ring-brand-coral ring-offset-2",
                    )}
                  >
                    {isComplete ? <Star className="h-5 w-5 fill-current" /> : meta.emoji}
                  </div>
                  {isActive && (
                    <span className="mt-2 rounded-pill bg-coral px-2 py-0.5 text-[10px] font-medium uppercase text-coral-foreground">
                      Current
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 ml-4 flex shrink-0 flex-col items-center gap-2"
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-lg border",
                allComplete ? "border-brand-deep bg-pale-green" : "border-dashed border-border bg-surface",
              )}
            >
              {allComplete ? (
                <Star className="h-6 w-6 text-brand-deep" />
              ) : (
                <Flag className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="max-w-[5rem] text-center font-display text-xs font-medium leading-tight text-muted-foreground">
              {allComplete ? "Complete" : "Finish"}
            </p>
          </motion.div>
        </div>
      </div>

      <p className="pb-4 text-center text-xs text-muted-foreground">
        Scroll horizontally to view all stages
      </p>
    </div>
  );
}
