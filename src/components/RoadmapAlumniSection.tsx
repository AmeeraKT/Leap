import { ExternalLink, Linkedin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ROADMAP_ALUMNI_BY_PHASE,
  ROADMAP_PHASE_ORDER,
  phaseShortLabel,
  type RoadmapPhaseName,
} from "@/lib/roadmap-alumni";
import { cn } from "@/lib/utils";

const PHASE_TINT: Record<RoadmapPhaseName, string> = {
  "Phase 1: Exploration": "bg-roadmap-tint-1 border-brand-deep/20 dark:border-brand-deep/35",
  "Phase 2: Building": "bg-roadmap-tint-2 border-border",
  "Phase 3: Launching": "bg-roadmap-tint-3 border-brand-navy/20 dark:border-brand-navy/35",
  "Phase 4: Connecting": "bg-roadmap-tint-4 border-brand-deep/15 dark:border-brand-deep/30",
  "Phase 5: Mastering": "bg-roadmap-tint-5 border-border",
  "Phase 6: Leading": "bg-roadmap-tint-6 border-brand-navy/20 dark:border-brand-navy/35",
};

export function RoadmapAlumniSection() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-7 dark:border-border/80 dark:bg-gradient-to-b dark:from-card dark:to-[hsl(240_9%_8%)]">
      <div className="mb-6">
        <div className="leap-mono-label flex items-center gap-2">
          <Users className="h-4 w-4 text-coral" />
          Alumni mentors
        </div>
        <h3 className="mt-2 font-display text-xl font-normal text-foreground md:text-2xl">
          Reach out by stage
        </h3>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          UQ and Brisbane alumni matched to each roadmap stage — connect on LinkedIn for advice at that step.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ROADMAP_PHASE_ORDER.map((phase, index) => {
          const alumni = ROADMAP_ALUMNI_BY_PHASE[phase];
          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className={cn("rounded-xl border p-4 space-y-3", PHASE_TINT[phase])}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Stage {index + 1}
                </p>
                <h4 className="font-display text-base font-normal text-foreground">
                  {phaseShortLabel(phase)}
                </h4>
              </div>

              <ul className="space-y-2">
                {alumni.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-xl border border-border/70 bg-card/95 p-3 transition-colors hover:border-coral/25 dark:bg-card/80"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.role} · {person.company}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{person.tip}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 gap-1 border-border/80 px-2"
                        asChild
                      >
                        <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-3.5 w-3.5" />
                          <span className="sr-only">LinkedIn</span>
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
