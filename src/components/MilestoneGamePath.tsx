import { useMemo } from "react";
import {
  Sparkles,
  Star,
  Flag,
  Compass,
  Hammer,
  Rocket,
  Users,
  Target,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Jumpy } from "@/components/Jumpy";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/lib/roadmap-store";
import { ROADMAP_PHASE_ORDER, phaseShortLabel } from "@/lib/roadmap-alumni";

const PHASE_META: Record<
  string,
  {
    stage: string;
    tint: string;
    node: string;
    icon: LucideIcon;
    jumpyLine: string;
  }
> = {
  "Phase 1: Exploration": {
    stage: "01",
    tint: "bg-roadmap-tint-1",
    node: "bg-brand-deep text-white",
    icon: Compass,
    jumpyLine: "Great place to start — explore what excites you!",
  },
  "Phase 2: Building": {
    stage: "02",
    tint: "bg-roadmap-tint-2",
    node: "bg-primary text-primary-foreground",
    icon: Hammer,
    jumpyLine: "Stack skills and projects — you're building momentum.",
  },
  "Phase 3: Launching": {
    stage: "03",
    tint: "bg-roadmap-tint-3",
    node: "bg-brand-navy text-white",
    icon: Rocket,
    jumpyLine: "Time to ship — launch something the world can see.",
  },
  "Phase 4: Connecting": {
    stage: "04",
    tint: "bg-roadmap-tint-4",
    node: "bg-brand-deep text-white",
    icon: Users,
    jumpyLine: "Grow your network — mentors and peers matter here.",
  },
  "Phase 5: Mastering": {
    stage: "05",
    tint: "bg-roadmap-tint-5",
    node: "bg-primary text-primary-foreground",
    icon: Target,
    jumpyLine: "Go deep — mastery is what sets you apart.",
  },
  "Phase 6: Leading": {
    stage: "06",
    tint: "bg-roadmap-tint-6",
    node: "bg-brand-navy text-white",
    icon: Crown,
    jumpyLine: "Lead the way — others will follow your example.",
  },
};

const DEFAULT_META = {
  stage: "•",
  tint: "bg-muted/30",
  node: "bg-muted text-foreground",
  icon: Star,
  jumpyLine: "Keep hopping — you've got this!",
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

export function getActiveRoadmapPhaseIndex(milestones: Milestone[]): number {
  const order = [...ROADMAP_PHASE_ORDER];
  for (let i = 0; i < order.length; i++) {
    const phaseMilestones = milestones.filter((m) => m.phase === order[i]);
    if (phaseMilestones.length === 0) continue;
    if (phaseMilestones.some((m) => !m.done)) return i;
  }
  return order.length - 1;
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
  const currentPhase = allComplete
    ? null
    : phases[activePhaseIndex >= 0 ? activePhaseIndex : 0];

  const pathWidth = 140 + phases.length * 320 + 140;

  return (
    <div className="roadmap-journey-shell overflow-hidden rounded-2xl border border-border bg-card shadow-none dark:border-border/80 dark:bg-gradient-to-b dark:from-card dark:via-card dark:to-[hsl(240_9%_7%)]">
      {/* Header */}
      <div className="relative border-b border-border/70 px-5 py-6 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-xl">
            <p className="leap-mono-label">Your career journey</p>
            <h3 className="mt-2 font-display text-2xl font-normal tracking-tight text-foreground md:text-3xl">
              Six stages to your goals
            </h3>
            {currentPhase && (
              <p className="mt-2 text-sm text-muted-foreground">
                You&apos;re in{" "}
                <span className="font-medium text-coral">
                  {phaseShortLabel(currentPhase.name as (typeof ROADMAP_PHASE_ORDER)[number])}
                </span>
                — check off milestones to unlock the next stage.
              </p>
            )}
            {allComplete && (
              <p className="mt-2 text-sm font-medium text-coral">Every stage complete — legendary hop!</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Jumpy size="sm" animate="float" glow className="opacity-90" />
            </div>
            <div className="min-w-[7rem] rounded-xl border border-border bg-background/60 px-5 py-3 text-center backdrop-blur-sm dark:bg-background/25">
              <div className="font-display text-3xl font-normal tabular-nums text-foreground">{overallPercent}%</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {totalDone}/{totalCount} done
              </div>
            </div>
          </div>
        </div>

        {/* Stage pills */}
        <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {phases.map((phase) => {
            const meta = PHASE_META[phase.name] ?? DEFAULT_META;
            const Icon = meta.icon;
            const isActive = phase.index === activePhaseIndex && !allComplete;
            const isComplete = phase.doneCount === phase.total && phase.total > 0;
            return (
              <div
                key={phase.name}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive && "border-coral/50 bg-coral/10 text-coral dark:bg-coral/15",
                  isComplete && !isActive && "border-brand-deep/30 bg-brand-deep/5 text-foreground dark:bg-brand-deep/20",
                  !isActive && !isComplete && "border-border bg-muted/30 text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{phaseShortLabel(phase.name as (typeof ROADMAP_PHASE_ORDER)[number])}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal journey */}
      <div className="overflow-x-auto pb-6 scrollbar-thin">
        <div
          className="relative mx-auto flex min-h-[480px] items-center px-8 py-12 md:px-12"
          style={{ minWidth: pathWidth }}
        >
          <div className="roadmap-path-line pointer-events-none absolute left-14 right-14 top-1/2 h-1 -translate-y-1/2 rounded-full" aria-hidden />

          {/* Start */}
          <div className="relative z-10 mr-6 flex shrink-0 flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-coral/40 bg-coral/10 dark:bg-coral/15">
              <span className="font-display text-xs font-medium text-coral">Go</span>
            </div>
          </div>

          {phases.map((phase, phaseIdx) => {
            const meta = PHASE_META[phase.name] ?? DEFAULT_META;
            const Icon = meta.icon;
            const isComplete = phase.doneCount === phase.total && phase.total > 0;
            const isActive = phase.index === activePhaseIndex && !allComplete;
            const cardAbove = phase.index % 2 === 0;
            const progressPercent =
              phase.total > 0 ? Math.round((phase.doneCount / phase.total) * 100) : 0;
            const pathSegmentDone = allComplete || phaseIdx < activePhaseIndex || (isComplete && !isActive);

            return (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phase.index * 0.06, duration: 0.45 }}
                className="relative z-10 mx-3 flex w-[min(300px,78vw)] shrink-0 flex-col items-center md:w-[320px]"
              >
                {/* Jumpy on current stage */}
                {isActive && (
                  <motion.div
                    className={cn(
                      "absolute z-30 flex flex-col items-center",
                      cardAbove ? "top-0 -translate-y-[88%]" : "bottom-[52%] translate-y-2",
                    )}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <div className="relative mb-1 max-w-[200px] rounded-2xl border border-coral/25 bg-card px-3 py-2 text-center text-xs font-medium leading-snug text-foreground shadow-md dark:border-coral/30 dark:bg-card/95 dark:shadow-coral/10">
                      <span className="text-coral">Jumpy · </span>
                      {meta.jumpyLine}
                      <div
                        className={cn(
                          "absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-coral/25 bg-card dark:bg-card/95",
                          cardAbove ? "-bottom-1 border-t-0 border-l-0" : "-top-1 border-b-0 border-r-0",
                        )}
                        aria-hidden
                      />
                    </div>
                    <Jumpy size="sm" animate="hop" glow className="drop-shadow-lg" />
                  </motion.div>
                )}

                <div className={cn("w-full", cardAbove ? "order-1 mb-5" : "order-3 mt-5")}>
                  <div
                    className={cn(
                      "overflow-hidden rounded-2xl border transition-all duration-300",
                      meta.tint,
                      isActive
                        ? "border-coral/40 shadow-lg shadow-coral/15 ring-1 ring-coral/30 dark:shadow-coral/25"
                        : "border-border/80",
                      isComplete && !isActive && "opacity-90",
                    )}
                  >
                    {isActive && (
                      <div className="border-b border-coral/20 bg-coral/10 px-4 py-2 text-center text-[11px] font-medium uppercase tracking-wider text-coral dark:bg-coral/15">
                        Your current stage
                      </div>
                    )}
                    <div className="p-4">
                      <div className="mb-3 flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                            meta.node,
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            Stage {meta.stage}
                          </p>
                          <h4 className="font-display text-lg font-normal leading-tight text-foreground">
                            {phase.name.replace(/^Phase \d+: /, "")}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-pill px-2.5 py-1 font-display text-xs font-medium tabular-nums",
                            isComplete
                              ? "bg-coral/15 text-coral"
                              : "bg-background/70 text-muted-foreground dark:bg-background/40",
                          )}
                        >
                          {phase.doneCount}/{phase.total}
                        </span>
                      </div>

                      <div className="mb-3 h-2 overflow-hidden rounded-pill bg-background/60 dark:bg-background/35">
                        <motion.div
                          className="h-full rounded-pill bg-gradient-to-r from-coral/80 to-coral"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>

                      <ul className="max-h-40 space-y-2 overflow-y-auto pr-0.5">
                        {phase.milestones.map((m) => (
                          <li
                            key={m.id}
                            onClick={() => onToggle(m.id)}
                            className={cn(
                              "group flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-all",
                              "border-border/60 bg-card hover:border-coral/30 hover:shadow-sm dark:bg-card/90",
                              m.done && "border-transparent bg-muted/20 opacity-75",
                              isActive && !m.done && "dark:hover:bg-card",
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
                                  m.done && "line-through opacity-55",
                                )}
                              >
                                {m.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                {m.desc}
                              </span>
                            </div>
                            {m.aiSuggested && (
                              <span className="shrink-0 rounded-md border border-coral/25 bg-coral/10 px-1.5 py-0.5 text-[10px] font-medium text-coral">
                                <Sparkles className="inline h-2.5 w-2.5" /> AI
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Path node */}
                <div className="order-2 flex flex-col items-center">
                  <div
                    className={cn(
                      "relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-background transition-transform duration-300",
                      meta.node,
                      pathSegmentDone && "border-coral/30",
                      isActive && "scale-110 ring-4 ring-coral/35 ring-offset-2 ring-offset-background",
                    )}
                  >
                    {isComplete ? (
                      <Star className="h-6 w-6 fill-current" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Finish + Jumpy when all complete */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 ml-6 flex shrink-0 flex-col items-center gap-3"
          >
            {allComplete && (
              <motion.div
                className="absolute -top-28 flex flex-col items-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-1 max-w-[160px] rounded-2xl border border-coral/25 bg-card px-3 py-2 text-center text-xs font-medium text-foreground shadow-md dark:bg-card/95">
                  <span className="text-coral">Jumpy · </span>You finished the whole map!
                </div>
                <Jumpy size="sm" animate="hop" glow />
              </motion.div>
            )}
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-colors",
                allComplete
                  ? "border-coral/50 bg-coral/15 text-coral dark:bg-coral/20"
                  : "border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground",
              )}
            >
              {allComplete ? (
                <Star className="h-7 w-7 fill-current" />
              ) : (
                <Flag className="h-7 w-7" />
              )}
            </div>
            <p className="text-center font-display text-xs font-medium text-muted-foreground">
              {allComplete ? "Complete" : "Finish line"}
            </p>
          </motion.div>
        </div>
      </div>

      <p className="border-t border-border/50 px-5 py-3 text-center text-xs text-muted-foreground">
        Scroll sideways to explore each stage · Jumpy marks where you are now
      </p>
    </div>
  );
}
