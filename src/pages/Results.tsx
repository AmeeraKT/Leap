import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  computePathwayMatches,
  defaultQuiz,
  type PathwayMatch,
  type QuizState,
} from "@/lib/quiz-types";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const [matches, setMatches] = useState<PathwayMatch[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("leap-quiz");
    if (raw) {
      try {
        const parsed = { ...defaultQuiz, ...JSON.parse(raw) } as QuizState;
        setData(parsed);
        setMatches(computePathwayMatches(parsed));
      } catch {
        setMatches(computePathwayMatches(defaultQuiz));
      }
    } else {
      setMatches(computePathwayMatches(defaultQuiz));
    }
  }, []);

  const firstName = useMemo(() => data.name?.split(" ")[0] || "friend", [data.name]);

  return (
    <AnimatedPage className="min-h-screen bg-background pb-32 overflow-x-hidden">
      <header className="container flex items-center justify-between py-6">
        <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-xl font-normal">Leap</span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => navigate("/quiz")}>
            Retake quiz
          </Button>
        </div>
      </header>

      <section className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5"
          >
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              Your top 3 pathway matches
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 font-display text-4xl font-normal md:text-5xl"
          >
            Here&apos;s where you could leap,{" "}
            <span className="text-primary">{firstName}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-muted-foreground md:text-lg"
          >
            Based on your studies, goals, and how you like to work — pick a path and start building.
          </motion.p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:gap-5">
          {matches.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 90, damping: 16 }}
              className="leap-card flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:gap-6 md:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral/10 font-display text-lg text-coral">
                #{i + 1}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-normal text-foreground md:text-2xl">
                    {m.title}
                  </h2>
                  <span className="font-display text-sm tabular-nums text-coral">{m.score}% match</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-coral" style={{ width: `${m.score}%` }} />
                </div>
                <p className="text-sm text-muted-foreground">{m.reason}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aiming for</p>
            <p className="mt-2 font-display text-lg text-foreground">
              {data.desiredField || "Your dream field"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{data.salaryExpectation || "Salary TBD"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starting from</p>
            <p className="mt-2 font-display text-lg text-foreground">
              {data.currentEducation || "Your studies"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.currentField || data.studyingAreas[0] || "Exploring options"}
            </p>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 80, damping: 15 }}
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 shadow-lg backdrop-blur"
      >
        <div className="container flex max-w-5xl items-center justify-between gap-3 py-4">
          <div className="min-w-0 text-sm">
            <div className="font-display font-normal">Ready to commit?</div>
            <div className="text-xs text-muted-foreground">Start building your step-by-step roadmap now.</div>
          </div>
          <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")} className="shrink-0">
            Go to dashboard
            <ArrowRight />
          </Button>
        </div>
      </motion.div>
    </AnimatedPage>
  );
};

export default Results;
