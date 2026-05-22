import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Brain, Clock, ShieldCheck, RefreshCw, 
  ChevronRight, Linkedin, Calendar, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MilestoneGamePath } from "@/components/MilestoneGamePath";
import { JumpyNudge } from "@/components/JumpyNudge";
import { useExperiences } from "@/lib/experiences-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useMilestones, usePlannerTasks, roadmapStore } from "@/lib/roadmap-store";
import { progressionStore, useProgression } from "@/lib/progression-store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
    },
  },
};

const Roadmap = () => {
  const experiences = useExperiences();
  const { toast } = useToast();
  const [activePlannerTab, setActivePlannerTab] = useState<"week" | "month" | "year">("week");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const milestones = useMilestones();
  const plannerTasks = usePlannerTasks();

  const toggleMilestone = (id: string, done?: boolean) => {
    roadmapStore.toggleMilestone(id, done);
  };

  const togglePlannerTask = (id: string, done?: boolean) => {
    roadmapStore.togglePlannerTask(id, done);
  };

  const regenerateAIPlan = async () => {
    setIsRegenerating(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const suggestedMilestones = [
      {
        id: `m-ai-${Date.now()}`,
        title: "Deploy application using Docker & Cloud",
        desc: "Learn containers for modern deployment.",
        done: false,
        phase: "Phase 2: Building",
        aiSuggested: true,
      },
      {
        id: `m-ai-${Date.now() + 1}`,
        title: "Write an engineering blog post about Rolldown bundling",
        desc: "Establish public tech leadership.",
        done: false,
        phase: "Phase 3: Launching",
        aiSuggested: true,
      },
    ];

    await roadmapStore.addMilestones(suggestedMilestones);
    setIsRegenerating(false);
    toast({
      title: "Roadmap updated with AI!",
      description: "Mistral AI analysed your logged skills and added cloud deployment milestones.",
    });
  };

  // Job Match Predictor calculation based on experiences
  const predictedJobs = useMemo(() => {
    const hasTypeScript = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("typescript") || s.toLowerCase().includes("react")));
    const hasAI = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("ai") || s.toLowerCase().includes("arduino")));
    const hasNetworking = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("networking") || s.toLowerCase().includes("communication")));

    const baseJobs = [
      {
        name: "Full-Stack Developer",
        baseScore: 55,
        boost: hasTypeScript ? 30 : 0,
        factor: "TypeScript / React experience logged",
        description: "Building responsive web pages and structured server APIs.",
      },
      {
        name: "AI Solutions Engineer",
        baseScore: 40,
        boost: hasAI ? 45 : 0,
        factor: "AI Workshop or prototyping logged",
        description: "Integrating LLMs, prompt pipelines, and autonomous agent loops.",
      },
      {
        name: "Cloud Architect",
        baseScore: 35,
        boost: experiences.some(e => e.title.includes("Cloud") || e.title.includes("AWS")) ? 50 : 15,
        factor: "Cloud platform exposure logged",
        description: "Designing scalable, containerized microservice architectures.",
      },
      {
        name: "Product & UX Manager",
        baseScore: 45,
        boost: hasNetworking ? 25 : 0,
        factor: "Networking and presentation events attended",
        description: "Synthesizing market needs and designing intuitive user flows.",
      },
    ];

    return baseJobs
      .map(j => ({
        ...j,
        totalScore: Math.min(98, j.baseScore + j.boost),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [experiences]);

  const activePlannerTasks = useMemo(() => {
    return plannerTasks.filter(pt => pt.timeframe === activePlannerTab);
  }, [plannerTasks, activePlannerTab]);

  const firstUnshared = experiences.find((e) => !Object.values(e.posted).some(Boolean));

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roadmap Planner</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Guide Your Career Goals</h1>
          <p className="text-sm text-muted-foreground">
            A personalized roadmap built to scale with your activities. See how every action impacts job matches.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={regenerateAIPlan}
            disabled={isRegenerating}
            variant="hero"
            className="self-start gap-2 font-bold py-5 px-5"
          >
            <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
            {isRegenerating ? "Regenerating..." : "Regenerate AI Plan"}
          </Button>
        </motion.div>
      </div>

      <div className="space-y-6">
          <Tabs defaultValue="milestones" className="w-full">
            <TabsList className="flex w-full justify-start gap-1 rounded-2xl border-2 border-border bg-surface p-1 flex-wrap font-display font-bold">
              <TabsTrigger value="milestones" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
                Personalized Milestones
              </TabsTrigger>
              <TabsTrigger value="planner" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
                Time Planner
              </TabsTrigger>
              <TabsTrigger value="brand" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
                Personal Brand Coaching ⭐
              </TabsTrigger>
            </TabsList>

            {/* Milestones Content — game-style quest path */}
            <TabsContent value="milestones" className="mt-6 space-y-6 focus-visible:outline-none">
              <MilestoneGamePath milestones={milestones} onToggle={toggleMilestone} />

              {/* Matched Job Predictions — below quest map */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="rounded-3xl border-2 border-border bg-surface p-5 md:p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary" />
                    <h3 className="font-display text-lg font-extrabold text-foreground">Matched Job Predictions</h3>
                  </div>
                  <Link to="/career-vision">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="outline" size="sm" className="text-xs font-black gap-1.5">
                        Career Vision Simulator <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your logged workshop skills, volunteering, projects, and fair attendance, our predictor calculates your career inclinations.
                </p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                  {predictedJobs.map((job) => (
                    <motion.div
                      key={job.name}
                      variants={cardVariants}
                      whileHover={{ y: -2 }}
                      className="space-y-2 rounded-2xl border-2 border-border bg-background p-4"
                    >
                      <div className="flex justify-between items-start gap-2 text-xs font-extrabold">
                        <span className="text-foreground leading-snug">{job.name}</span>
                        <span className="shrink-0 text-secondary">{job.totalScore}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${job.totalScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-snug">{job.description}</p>

                      <div className="flex items-center gap-1 text-[9px] font-black text-coral uppercase tracking-wider">
                        <ShieldCheck className="h-3 w-3 shrink-0" /> {job.factor}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            </TabsContent>

            {/* Time Planner Content */}
            <TabsContent value="planner" className="mt-6 space-y-6 focus-visible:outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="rounded-3xl border-2 border-border bg-surface p-5 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-black text-foreground">Schedule Planner</h3>
                    <p className="text-xs text-muted-foreground">Break goals down into week, month, and year checklists.</p>
                  </div>

                  {/* Sub tabs for planner */}
                  <div className="flex bg-background rounded-xl p-1 border border-border h-10 w-fit items-center">
                    {(["week", "month", "year"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActivePlannerTab(t)}
                        className="relative rounded-lg px-4 text-xs font-bold capitalize h-8 transition-colors z-10 flex items-center justify-center"
                        style={{ color: activePlannerTab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                      >
                        {activePlannerTab === t && (
                          <motion.div
                            layoutId="activePlannerTabBg"
                            className="absolute inset-0 rounded-lg bg-secondary z-0"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className={cn("relative z-10", activePlannerTab === t ? "font-black" : "hover:text-foreground")}>
                          {t}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planner tasks checklist */}
                <motion.ul layout className="space-y-2 pt-2">
                  <AnimatePresence mode="popLayout">
                    {activePlannerTasks.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="empty"
                        className="text-center py-6 text-sm text-muted-foreground"
                      >
                        No tasks scheduled for this timeframe.
                      </motion.div>
                    ) : (
                      activePlannerTasks.map((pt) => (
                        <motion.li
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={pt.id}
                          onClick={() => togglePlannerTask(pt.id)}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center justify-between rounded-xl border-2 p-3.5 bg-background cursor-pointer hover:border-foreground/20 transition-all",
                            pt.done ? "border-border/40 opacity-70" : "border-border shadow-sm",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={pt.done}
                                onCheckedChange={(v) => togglePlannerTask(pt.id, v === true)}
                              />
                            </div>
                            <span className={cn("text-sm font-bold text-foreground", pt.done && "text-muted-foreground line-through")}>
                              {pt.task}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {pt.dueDate}
                          </span>
                        </motion.li>
                      ))
                    )}
                  </AnimatePresence>
                </motion.ul>
              </motion.div>
            </TabsContent>

            {/* Personal Brand Coaching */}
            <TabsContent value="brand" className="mt-6 space-y-6 focus-visible:outline-none">
              {firstUnshared && (
                <JumpyNudge
                  message={`I noticed you logged "${firstUnshared.title}" but haven't shared it yet. Want me to draft a post? 🚀`}
                  ctaLabel="Draft post"
                  to={`/journey/${firstUnshared.id}`}
                />
              )}

              {/* Metric cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  icon={<Linkedin className="h-4 w-4" />}
                  title="LinkedIn Completeness"
                  value="65%"
                  progress={65}
                  hint="Missing: Recommendations, Featured, Custom URL"
                  cta="Fix this now"
                />
                <MetricCard
                  icon={<Calendar className="h-4 w-4" />}
                  title="Content Consistency"
                  value={`${experiences.filter(e => Object.values(e.posted).some(Boolean)).length} / 4`}
                  progress={Math.min(100, (experiences.filter(e => Object.values(e.posted).some(Boolean)).length / 4) * 100)}
                  hint="Posts this month · goal 2-4"
                  cta="Plan next post"
                  ctaTo="/journey"
                />
                <MetricCard
                  icon={<TrendingUp className="h-4 w-4" />}
                  title="Network Growth"
                  value="+12"
                  progress={48}
                  hint="New connections in April"
                  chart
                />
              </div>

              {/* Modules */}
              <div className="grid gap-4 md:grid-cols-2">
                <Module
                  title="Module 1 · LinkedIn Foundations"
                  items={[
                    { id: "m1-0", label: "Professional headshot uploaded", done: true },
                    { id: "m1-1", label: "Headline optimized (not just 'Student at X')", done: true },
                    { id: "m1-2", label: "About section tells your story", done: false },
                    { id: "m1-3", label: "Custom LinkedIn URL set", done: false },
                    { id: "m1-4", label: "5+ recommendations received", done: false },
                  ]}
                />
                <Module
                  title="Module 2 · Content Strategy"
                  items={[
                    { id: "m2-0", label: "First post published", done: true },
                    { id: "m2-1", label: "Consistent posting (2-4x / month)", done: false },
                    { id: "m2-2", label: "Engaged with 10+ industry posts", done: false },
                    { id: "m2-3", label: "Joined 3+ relevant LinkedIn groups", done: false },
                  ]}
                />
                <Module
                  title="Module 3 · Thought Leadership"
                  items={[
                    { id: "m3-0", label: "Shared a unique perspective post", done: false },
                    { id: "m3-1", label: "Commented meaningfully on industry trends", done: false },
                    { id: "m3-2", label: "Published a LinkedIn article", done: false },
                  ]}
                />
                <Module
                  title="Module 4 · Portfolio Building"
                  items={[
                    {
                      id: "m4-0",
                      label: `${experiences.length}+ experiences documented`,
                      done: experiences.length >= 5,
                      readOnly: true,
                    },
                    { id: "m4-1", label: "Created visual portfolio page", done: false },
                    { id: "m4-2", label: "Shared portfolio link in bio", done: false },
                  ]}
                />
              </div>
            </TabsContent>
          </Tabs>
      </div>
    </AnimatedPage>
  );
};

const MetricCard = ({
  icon, title, value, progress, hint, cta, ctaTo, chart,
}: {
  icon: React.ReactNode; title: string; value: string; progress: number;
  hint: string; cta?: string; ctaTo?: string; chart?: boolean;
}) => (
  <div className="rounded-3xl border-2 border-border bg-surface p-5">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {icon} {title}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="font-display text-3xl font-black">{value}</span>
    </div>
    {chart ? (
      <div className="mt-3 flex h-10 items-end gap-1">
        {[20, 35, 28, 50, 42, 65, 58, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-secondary/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    ) : (
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-secondary" style={{ width: `${progress}%` }} />
      </div>
    )}
    <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    {cta && (
      ctaTo ? (
        <Link to={ctaTo} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">
          {cta} <ArrowRight className="h-3 w-3" />
        </Link>
      ) : (
        <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline">
          {cta} <ArrowRight className="h-3 w-3" />
        </button>
      )
    )}
  </div>
);

const Module = ({
  title,
  items,
}: {
  title: string;
  items: { id: string; label: string; done: boolean; readOnly?: boolean }[];
}) => {
  const { roadmapTaskState } = useProgression();
  const resolved = items.map((item) => ({
    ...item,
    checked: item.readOnly ? item.done : (roadmapTaskState[`brand-${item.id}`] ?? item.done),
  }));
  const doneCount = resolved.filter((i) => i.checked).length;

  return (
    <div className="rounded-3xl border-2 border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-extrabold">{title}</h3>
        <span className="text-xs font-bold text-muted-foreground">
          {doneCount}/{items.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {resolved.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={item.checked}
              disabled={item.readOnly}
              onCheckedChange={(v) =>
                progressionStore.toggleRoadmapTask(`brand-${item.id}`, v === true, item.done)
              }
              onClick={(e) => e.stopPropagation()}
            />
            <span className={cn(item.checked && "text-muted-foreground line-through")}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roadmap;
