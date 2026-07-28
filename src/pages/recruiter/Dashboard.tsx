import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { students } from "@/data/students";
import { StudentCard } from "@/components/recruiter/StudentCard";
import { PremiumGate } from "@/components/recruiter/PremiumGate";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { matchStudents } from "@/lib/recruiter-matching";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

const trendingSkills = ["React", "TypeScript", "Machine Learning", "Figma", "Product Thinking"];

const RecruiterDashboard = () => {
  const { shortlist, messages, isPremium } = useRecruiter();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const featuredStudents = useMemo(() => students.filter((s) => s.featured), []);

  const topMajors = useMemo(() => {
    const counts = new Map<string, number>();
    for (const student of students) {
      for (const major of student.majors) {
        counts.set(major, (counts.get(major) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, []);

  const totalUnread = useMemo(
    () => Object.values(messages).reduce((sum, arr) => sum + arr.length, 0),
    [messages],
  );

  const searchResults = useMemo(() => {
    if (!submittedQuery.trim()) return [];
    return matchStudents(students, submittedQuery);
  }, [submittedQuery]);

  return (
    <AnimatedPage className="container space-y-8 py-8 md:py-10">
      <motion.section {...reveal} className="leap-panel rounded-2xl border border-border bg-card p-5 md:p-6">
        <h1 className="font-display text-3xl font-normal md:text-4xl">Recruiter Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Command center for finding standout students and tracking outreach momentum.
        </p>

        <div className="mt-6">
          <PremiumGate
            mode="badge"
            fallback={
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-coral">
                  <Sparkles className="h-3.5 w-3.5" /> Premium
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  <Input
                    value="What talent are you looking for today?"
                    disabled
                    className="h-11 rounded-full opacity-70"
                  />
                  <Button disabled className="rounded-full">
                    Find matches
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Upgrade to run AI candidate matching.</p>
              </div>
            }
          >
            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmittedQuery(query.trim());
              }}
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What talent are you looking for today?"
                className="h-11 rounded-full"
                disabled={!isPremium}
              />
              <Button type="submit" variant="hero" className="rounded-full px-5">
                <Search className="mr-1 h-4 w-4" />
                Find matches
              </Button>
            </form>
          </PremiumGate>
        </div>
      </motion.section>

      {submittedQuery && (
        <motion.section {...reveal} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-normal">Match results</h2>
            <p className="text-sm text-muted-foreground">
              {searchResults.length} match{searchResults.length === 1 ? "" : "es"}
            </p>
          </div>
          {searchResults.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
              No matches for "{submittedQuery}" yet. Try another keyword.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </motion.section>
      )}

      <motion.section {...reveal} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-normal">Spotlight students</h2>
          <a href="/recruiter/discover" className="inline-flex items-center gap-1 text-sm font-semibold text-coral">
            Browse all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
          {featuredStudents.map((student) => (
            <div key={student.id} className="flex min-w-[18rem] flex-1 md:min-w-[22rem]">
              <StudentCard student={student} variant="spotlight" />
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...reveal} className="grid gap-5 lg:grid-cols-2">
        <div className="leap-panel rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-xl font-normal">Top hiring trends</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {trendingSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold">Most-active majors</p>
            {topMajors.map(([major, count]) => (
              <div key={major} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{major}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/20">
                  <div className="h-full rounded-full bg-coral" style={{ width: `${Math.min(100, count * 22)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="leap-panel rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-xl font-normal">Your activity</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs text-muted-foreground">Shortlist</p>
              <p className="mt-1 font-display text-2xl">{shortlist.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs text-muted-foreground">Unread messages</p>
              <p className="mt-1 font-display text-2xl">{totalUnread}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs text-muted-foreground">Viewed today</p>
              <p className="mt-1 font-display text-2xl">4</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rising students</p>
            <div className="mt-2 space-y-2">
              {students.slice(0, 2).map((s) => (
                <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                  <img src={s.photo} alt={s.name} className="h-8 w-8 rounded-full border border-border object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.oneLiner}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

export default RecruiterDashboard;

