import { useMemo } from "react";
import { BarChart3, Lock } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { students } from "@/data/students";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { Button } from "@/components/ui/button";

function AnalyticsContent() {
  const universityBars = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => {
      map.set(s.university, (map.get(s.university) ?? 0) + s.contactedCount);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  const majorInterest = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => {
      s.majors.forEach((major) => {
        map.set(major, (map.get(major) ?? 0) + s.contactedCount);
      });
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  const skillTrend = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => s.skills.forEach((skill) => map.set(skill, (map.get(skill) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, []);

  const startupPct = Math.round((students.filter((s) => s.hasStartup).length / students.length) * 100);
  const projectsPct = Math.round((students.filter((s) => s.hasProjects).length / students.length) * 100);
  const avgYear = (
    students.reduce((sum, s) => sum + s.year, 0) / Math.max(1, students.length)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Students in pool</p><p className="mt-1 font-display text-3xl">{students.length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Building a startup</p><p className="mt-1 font-display text-3xl">{startupPct}%</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">With projects</p><p className="mt-1 font-display text-3xl">{projectsPct}%</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Average year level</p><p className="mt-1 font-display text-3xl">{avgYear}</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display text-xl font-normal">Most-contacted universities</h3>
          <div className="mt-4 space-y-3">
            {universityBars.map(([name, value]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-sm"><span>{name}</span><span className="text-muted-foreground">{value}</span></div>
                <div className="h-2 rounded-full bg-secondary/20"><div className="h-full rounded-full bg-coral" style={{ width: `${Math.min(100, value * 14)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display text-xl font-normal">Recruiter interest by major</h3>
          <div className="mt-4 space-y-3">
            {majorInterest.map(([name, value]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-sm"><span>{name}</span><span className="text-muted-foreground">{value}</span></div>
                <div className="h-2 rounded-full bg-secondary/20"><div className="h-full rounded-full bg-foreground" style={{ width: `${Math.min(100, value * 10)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-display text-xl font-normal">Trending skills</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {skillTrend.map(([skill, count]) => (
            <span key={skill} className="rounded-full border border-coral/30 bg-secondary/20 px-3 py-1 text-xs font-semibold">
              {skill} · {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const RecruiterAnalytics = () => {
  const { isPremium } = useRecruiter();

  if (!isPremium) {
    return (
      <AnimatedPage className="container py-10">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />
            <div className="absolute inset-0 m-4 rounded-xl border border-border/50 bg-muted/20" />
          </div>
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/25 text-coral">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="font-display text-3xl font-normal md:text-4xl">Analytics</h1>
            <p className="mt-2 text-sm text-muted-foreground">Unlock hiring insights & talent analytics.</p>
            <Button variant="hero" className="mt-4">Upgrade</Button>
          </div>
          <div className="relative z-0 mt-6 opacity-45 blur-[1px]">
            <AnalyticsContent />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="container space-y-5 py-8 md:py-10">
      <div>
        <h1 className="font-display text-3xl font-normal md:text-4xl">Analytics</h1>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary/25 px-3 py-1 text-xs font-semibold text-coral">
          <BarChart3 className="h-3.5 w-3.5" /> Premium insights
        </p>
      </div>
      <AnalyticsContent />
    </AnimatedPage>
  );
};

export default RecruiterAnalytics;

