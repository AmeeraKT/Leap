export const ROADMAP_PHASE_ORDER = [
  "Phase 1: Exploration",
  "Phase 2: Building",
  "Phase 3: Launching",
  "Phase 4: Connecting",
  "Phase 5: Mastering",
  "Phase 6: Leading",
] as const;

export type RoadmapPhaseName = (typeof ROADMAP_PHASE_ORDER)[number];

export function phaseShortLabel(phase: string): string {
  return phase.replace(/^Phase \d+: /, "");
}
