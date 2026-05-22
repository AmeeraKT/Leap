import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { JumpyLauncher } from "@/components/JumpyLauncher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("leap-quiz");
    if (raw) try { setData({ ...defaultQuiz, ...JSON.parse(raw) }); } catch { }
    const t = setTimeout(() => setTransformed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const firstName = useMemo(() => (data.name?.split(" ")[0] || "friend"), [data.name]);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top */}
      <header className="container flex items-center justify-between py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-xl font-extrabold">Leap</span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => navigate("/quiz")}>Retake quiz</Button>
        </div>
      </header>

      {/* Hero / transformation */}
      <section className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-xs font-bold uppercase tracking-wider text-coral">Your matches are ready</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">
            Here's where you want to be,{" "}
            <span className="text-primary">{firstName}</span>…
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
            …and here's where you are now. Let's build the path between them.
          </p>
        </div>

        {/* Transformation cards */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <TransformCard
            label="Dream Career Jumpy"
            title={data.desiredField || "Engineer Wizard"}
            subtitle="Future you"
            tone="dream"
            visible
          />
          <TransformCard
            label="Current You Jumpy"
            title={data.currentEducation ? `Current ${data.currentEducation}` : "Curious explorer"}
            subtitle="Where you are now"
            tone="current"
            visible={transformed}
          />
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-surface/95 backdrop-blur">
        <div className="container flex max-w-5xl items-center justify-between py-4">
          <div className="text-sm">
            <div className="font-display font-extrabold">Ready to commit?</div>
            <div className="text-xs text-muted-foreground">Start building your step-by-step roadmap now.</div>
          </div>
          <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
            Go to dashboard
            <ArrowRight />
          </Button>
        </div>
      </div>
      <JumpyLauncher />
    </div>
  );
};

/* ---------- subcomponents ---------- */

const TransformCard = ({
  label,
  title,
  subtitle,
  tone,
  visible,
}: {
  label: string;
  title: string;
  subtitle: string;
  tone: "dream" | "current";
  visible: boolean;
}) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-3xl border-2 p-8 text-center transition-all duration-700",
      tone === "dream" ? "border-secondary bg-secondary/15" : "border-border bg-surface",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
    )}
  >
    {tone === "dream" && (
      <div className="absolute inset-0 -z-10 m-auto h-40 w-40 rounded-full bg-secondary/40 blur-3xl" />
    )}
    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-4 flex justify-center">
      <Jumpy size="md" animate={tone === "dream" ? "hop" : "float"} glow={tone === "dream"} />
    </div>
    <div className="mt-4 font-display text-2xl font-black">{title}</div>
    <div className="text-sm text-muted-foreground">{subtitle}</div>
    {tone === "dream" && (
      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1 text-xs font-bold text-coral">
        ✨ Aspirational
      </div>
    )}
  </div>
);
export default Results;
