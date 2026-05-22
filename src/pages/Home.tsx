import {
  ArrowRight,
  Sparkles,
  Target,
  Map,
  ShieldCheck,
  Trophy,
  BookOpen,
  Brain,
  Route,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const features = [
  {
    icon: Target,
    title: "Quiz & pathway plans",
    body: "Sign up or try the demo, get your top 3 pathway matches, and compare plans that fit your goals.",
    to: "/quiz",
  },
  {
    icon: Route,
    title: "Quest roadmap",
    body: "Follow a cartoon career map with milestones, planner checklists, brand coaching, and job predictions.",
    to: "/roadmap",
  },
  {
    icon: BookOpen,
    title: "Journey log",
    body: "Log workshops and projects, draft social posts, track streaks, and earn XP as you build your brand.",
    to: "/journey",
  },
  {
    icon: Brain,
    title: "Career Vision",
    body: "AI job matches from your experience, resume feedback, and a coach chat with Jumpy when you need help.",
    to: "/career-vision",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Start in seconds",
    body: "Create an account or use the one-click demo — no setup friction.",
  },
  {
    step: "02",
    title: "Match your path",
    body: "Complete the quiz, review your top pathways, and open your student dashboard.",
  },
  {
    step: "03",
    title: "Log & discover",
    body: "Record experiences in Journey Log, RSVP to events, and join communities in Discover.",
  },
  {
    step: "04",
    title: "Level up & launch",
    body: "Clear quest milestones for XP, follow your roadmap, and use Career Vision to target roles.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
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

const Home = () => {
  return (
    <AnimatedPage className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-2xl font-extrabold text-foreground">Leap</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Get started
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/quiz">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Career quest · XP · AI coach
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl font-black leading-[1.05] text-foreground md:text-7xl"
          >
            Build your career like a{" "}
            <span className="text-coral">game</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-lg text-lg text-muted-foreground">
            Leap helps students log real experiences, follow a visual quest roadmap, earn XP, discover
            events, and get AI job matches — with Jumpy the frog cheering you on every hop.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <Link to="/quiz">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl">
                  Get started
                  <ArrowRight />
                </Button>
              </motion.div>
            </Link>
            <Link to="/quiz">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="font-bold">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  Try demo account
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
            One-click demo · Earn XP from checklist tasks · Works offline in demo mode
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <div className="font-display text-2xl font-extrabold">4</div>
              <div className="text-xs text-muted-foreground">Core tools</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-extrabold flex items-center gap-1">
                <Trophy className="h-5 w-5 text-coral" /> XP
              </div>
              <div className="text-xs text-muted-foreground">Levels & badges</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-extrabold flex items-center gap-1">
                <Map className="h-5 w-5 text-secondary" /> Quest
              </div>
              <div className="text-xs text-muted-foreground">Cartoon roadmap</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 -z-10 m-auto h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Jumpy size="xl" animate="hop" glow />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-black md:text-5xl">Everything in your Leap hub</h2>
            <p className="mt-3 text-primary-foreground/70">
              Four tools that take you from “what’s next?” to job-ready — tap a card to explore.
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f) => (
              <Link key={f.title} to={f.to}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full rounded-2xl bg-surface p-6 text-foreground shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-extrabold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-coral">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-black md:text-5xl">How Leap works</h2>
          <p className="mt-3 text-muted-foreground">Four hops from sign-up to career momentum.</p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {howItWorks.map((s) => (
            <motion.div
              key={s.step}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm"
            >
              <div className="font-display text-5xl font-black text-secondary">{s.step}</div>
              <h3 className="mt-4 font-display text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section id="about" className="container pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative overflow-hidden rounded-3xl bg-secondary p-10 md:p-16 shadow-lg"
        >
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground md:text-5xl">Ready to make the leap?</h2>
              <p className="mt-3 max-w-xl text-foreground/80">
                Jump into the demo as Alex Chen, explore the quest map, log a win, and watch your XP climb on
                the dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/quiz">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="default" size="xl">
                      <Sparkles className="h-4 w-4" />
                      Try demo account
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/quiz">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="xl" className="bg-background/80">
                      Create account
                      <ArrowRight />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Jumpy size="lg" animate="hop" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="container border-t-2 border-border py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="none" />
            <span className="font-display font-extrabold text-foreground">Leap</span>
          </div>
          <div>© {new Date().getFullYear()} Leap. Built with 🐸 for students building their brand.</div>
        </div>
      </footer>
    </AnimatedPage>
  );
};

export default Home;
