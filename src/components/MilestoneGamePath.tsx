import { useMemo } from "react";
import {
  Sparkles,
  Star,
  Lock,
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
    jumpyLine: "You're doing amazing — keep exploring!",
  },
  "Phase 2: Building": {
    stage: "02",
    tint: "bg-roadmap-tint-2",
    node: "bg-primary text-primary-foreground",
    icon: Hammer,
    jumpyLine: "Proud of your progress — one skill at a time!",
  },
  "Phase 3: Launching": {
    stage: "03",
    tint: "bg-roadmap-tint-3",
    node: "bg-brand-navy text-white",
    icon: Rocket,
    jumpyLine: "You've got this — ship something today!",
  },
  "Phase 4: Connecting": {
    stage: "04",
    tint: "bg-roadmap-tint-4",
    node: "bg-brand-deep text-white",
    icon: Users,
    jumpyLine: "You're building real connections — keep going!",
  },
  "Phase 5: Mastering": {
    stage: "05",
    tint: "bg-roadmap-tint-5",
    node: "bg-primary text-primary-foreground",
    icon: Target,
    jumpyLine: "Depth looks great on you — keep mastering!",
  },
  "Phase 6: Leading": {
    stage: "06",
    tint: "bg-roadmap-tint-6",
    node: "bg-brand-navy text-white",
    icon: Crown,
    jumpyLine: "Lead with kindness — you're inspiring others!",
  },
};

const DEFAULT_META = {
  stage: "•",
  tint: "bg-muted/30",
  node: "bg-muted text-foreground",
  icon: Star,
  jumpyLine: "Keep hopping — you're doing wonderfully!",
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
          <div className="min-w-[7rem] rounded-xl border border-border bg-background/60 px-5 py-3 text-center backdrop-blur-sm dark:bg-background/25">
            <div className="font-display text-3xl font-normal tabular-nums text-foreground">{overallPercent}%</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {totalDone}/{totalCount} done
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
            const status: "unlocked" | "locked" =
              allComplete || phase.index <= activePhaseIndex || isComplete ? "unlocked" : "locked";
            return (
              <div
                key={phase.name}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive && "border-coral/50 bg-coral/10 text-coral dark:bg-coral/15",
                  status === "unlocked" && !isActive && "border-coral/25 bg-coral/5 text-foreground",
                  status === "locked" && "border-border bg-muted/40 text-muted-foreground",
                )}
              >
                {status === "locked" ? (
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {phaseShortLabel(phase.name as (typeof ROADMAP_PHASE_ORDER)[number])}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal stage cards — ~2 visible at a time, scroll for the rest */}
      <div className="overflow-x-auto pb-2 scrollbar-thin" style={{ containerType: "inline-size" }}>
        <div className="flex w-max gap-4 p-4 sm:gap-5 sm:p-5 md:gap-6 md:p-8">
          {phases.map((phase) => {
            const meta = PHASE_META[phase.name] ?? DEFAULT_META;
            const Icon = meta.icon;
            const isComplete = phase.doneCount === phase.total && phase.total > 0;
            const isActive = phase.index === activePhaseIndex && !allComplete;
            const status: "unlocked" | "locked" =
              allComplete || phase.index <= activePhaseIndex || isComplete ? "unlocked" : "locked";
            const progressPercent =
              phase.total > 0 ? Math.round((phase.doneCount / phase.total) * 100) : 0;

            return (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phase.index * 0.05, duration: 0.4 }}
                className="flex shrink-0 flex-col"
                style={{
                  width:
                    "max(280px, calc((100cqi - 4rem - 1.5rem) / 2))",
                }}
              >
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border transition-all duration-300",
                    status === "unlocked" && "border-coral/30 bg-coral/10",
                    status === "locked" && "border-border bg-muted/40 opacity-80",
                    isActive && "ring-1 ring-coral/35 shadow-md shadow-coral/10",
                  )}
                >
                  {isActive && (
                    <div className="border-b border-coral/20 bg-coral/15 px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-coral">
                      Your current stage
                    </div>
                  )}
                  {status === "locked" && (
                    <div className="flex items-center justify-center gap-1.5 border-b border-border/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Locked — finish the previous stage
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="group relative shrink-0 pt-5">
                        {isActive && (
                          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                            <div className="relative flex flex-col items-center">
                              <div
                                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-max max-w-[160px] -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-center text-[10px] font-medium leading-snug text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
                                role="tooltip"
                              >
                                {meta.jumpyLine}
                                <span
                                  className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-foreground"
                                  aria-hidden
                                />
                              </div>
                              <Jumpy size="xs" animate="hop" className="drop-shadow-sm" />
                            </div>
                          </div>
                        )}
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl",
                            status === "locked" ? "bg-muted text-muted-foreground" : meta.node,
                          )}
                        >
                          {status === "locked" ? (
                            <Lock className="h-5 w-5" />
                          ) : isComplete ? (
                            <Star className="h-5 w-5 fill-current" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 pt-5">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Stage {meta.stage}
                        </p>
                        <h4 className="font-display text-xl font-normal leading-tight text-foreground">
                          {phase.name.replace(/^Phase \d+: /, "")}
                        </h4>
                      </div>
                      <span
                        className={cn(
                          "mt-5 shrink-0 rounded-pill px-2.5 py-1 font-display text-xs font-medium tabular-nums",
                          isComplete
                            ? "bg-coral/15 text-coral"
                            : "bg-background/70 text-muted-foreground dark:bg-background/40",
                        )}
                      >
                        {phase.doneCount}/{phase.total}
                      </span>
                    </div>

                    <div className="mb-5 h-2 overflow-hidden rounded-pill bg-background/60 dark:bg-background/35">
                      <motion.div
                        className={cn(
                          "h-full rounded-pill",
                          status === "locked"
                            ? "bg-muted-foreground/30"
                            : "bg-gradient-to-r from-coral/80 to-coral",
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>

                    <ul className="space-y-3">
                      {phase.milestones.map((m) => (
                        <li
                          key={m.id}
                          onClick={() => {
                            if (status === "locked") return;
                            onToggle(m.id);
                          }}
                          className={cn(
                            "group/item flex items-start gap-3 rounded-xl border p-3.5 transition-all md:p-4",
                            status === "locked"
                              ? "cursor-not-allowed border-border/40 bg-background/40"
                              : "cursor-pointer border-border/60 bg-card hover:border-coral/30 hover:shadow-sm dark:bg-card/90",
                            m.done && status === "unlocked" && "border-transparent bg-muted/20 opacity-75",
                          )}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={m.done}
                              disabled={status === "locked"}
                              onCheckedChange={(v) => {
                                if (status === "locked") return;
                                onToggle(m.id, v === true);
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={cn(
                                  "block text-sm font-medium leading-snug text-foreground",
                                  m.done && "line-through opacity-55",
                                )}
                              >
                                {m.title}
                              </span>
                              {!m.done && status === "unlocked" && (
                                <span className="shrink-0 rounded-pill bg-coral/15 px-2 py-0.5 font-display text-[10px] font-medium tabular-nums text-coral">
                                  +15 pts
                                </span>
                              )}
                            </div>
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
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
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="border-t border-border/50 px-5 py-3 text-center text-xs text-muted-foreground">
        Scroll sideways to see every stage · Jumpy marks where you are now
      </p>
    </div>
  );
}
