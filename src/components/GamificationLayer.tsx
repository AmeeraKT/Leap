import { useEffect, useState } from "react";
import { JumpyCelebration } from "@/components/JumpyCelebration";
import { evaluateAchievements } from "@/lib/achievements";
import { experiencesStore } from "@/lib/experiences-store";
import { progressionStore, useProgression, type CelebrationEvent } from "@/lib/progression-store";

export const GamificationLayer = () => {
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  useProgression();

  useEffect(() => {
    let hydrated = false;
    const runEval = (silent = false) =>
      evaluateAchievements(experiencesStore.list(), { silent });

    runEval(true);
    hydrated = true;

    const unsubProgression = progressionStore.subscribe(() => {
      if (hydrated) runEval(false);
      const next = progressionStore.consumeCelebration();
      if (next) setCelebration(next);
    });

    const unsubExperiences = experiencesStore.subscribe(() => {
      if (hydrated) runEval(false);
    });

    const pending = progressionStore.consumeCelebration();
    if (pending) setCelebration(pending);

    return () => {
      unsubProgression();
      unsubExperiences();
    };
  }, []);

  const handleClose = () => {
    setCelebration(null);
    const next = progressionStore.consumeCelebration();
    if (next) setCelebration(next);
  };

  return <JumpyCelebration event={celebration} onClose={handleClose} />;
};
