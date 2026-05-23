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

const PHASE_ACCENT: Record<RoadmapPhaseName, string> = {
  "Phase 1: Exploration": "border-border bg-pale-green",
  "Phase 2: Building": "border-border bg-soft-stone",
  "Phase 3: Launching": "border-border bg-pale-blue",
  "Phase 4: Connecting": "border-border bg-surface",
  "Phase 5: Mastering": "border-border bg-soft-stone",
  "Phase 6: Leading": "border-border bg-pale-green",
};

export function RoadmapAlumniSection() {
  return (
    <section className="leap-card space-y-5 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="leap-mono-label flex items-center gap-2">
            <Users className="h-4 w-4" />
            Alumni mentors
          </div>
          <h3 className="mt-2 font-display text-lg font-normal text-foreground md:text-xl">
            Reach out by stage
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            UQ and Brisbane alumni matched to each roadmap stage — connect on LinkedIn for advice at that step.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ROADMAP_PHASE_ORDER.map((phase, index) => {
          const alumni = ROADMAP_ALUMNI_BY_PHASE[phase];
          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className={cn("rounded-lg border p-4 space-y-3", PHASE_ACCENT[phase])}
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
                    key={person.name}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-card p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.role}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{person.focus}</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 h-8 gap-1 px-2" asChild>
                      <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-3.5 w-3.5" />
                        <span className="sr-only">LinkedIn</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
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
