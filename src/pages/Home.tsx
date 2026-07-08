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
    body: "Follow a six-stage career map with milestones, planner checklists, brand coaching, and job predictions.",
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
    title: "Explore",
    body: "Discover yourself and potential career paths. Jumpy AI personalizes suggestions of events and opportunities that fit you best.",
  },
  {
    step: "02",
    title: "Engage",
    body: "Turn your career development into action. Curated events, like-minded communities and personal brand coaching sessions helps make you stand out in the crowd.",
  },
  {
    step: "03",
    title: "Capture",
    body: "Turn your everyday experiences into career-ready evidence. Log events and their details so you can never forget them in interviews.",
  },
  {
    step: "04",
    title: "Showcase",
    body: "Turn your growth into opportunities. LEAP transforms experience logs into portfolio format or social media content so employers can see your growth..",
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
          <span className="font-display text-2xl font-normal text-foreground">Leap</span>
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
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl font-normal leading-[1.02] text-foreground md:text-6xl lg:text-7xl"
          >
            Plan your career with{" "}
            <span className="text-coral">clarity</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-lg text-lg text-muted-foreground leading-relaxed">
            Leap helps students log real experiences, follow a structured roadmap, earn XP, discover
            events, and get AI job matches — with Jumpy guiding each step.
          </motion.p>

          <motion.div variants={itemVariants} className="flex w-fit max-w-full flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
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
            </div>

            <Link to="/waitlist" className="block w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button variant="coral" size="lg" className="w-full font-bold">
                  Join waitlist
                  <ArrowRight />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <div className="font-display text-2xl font-normal">4</div>
              <div className="text-xs text-muted-foreground">Core tools</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-normal flex items-center gap-1">
                <Trophy className="h-5 w-5 text-coral" /> XP
              </div>
              <div className="text-xs text-muted-foreground">Levels & badges</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-normal flex items-center gap-1">
                <Map className="h-5 w-5 text-secondary" /> Quest
              </div>
              <div className="text-xs text-muted-foreground">Six-stage roadmap</div>
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
      <section id="features" className="leap-band-deep py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-normal text-white md:text-5xl">Recipe to your Success</h2>
            <p className="mt-3 text-white/75">
              Four tools that take you from “what’s next?” to job-ready.
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
                  className="leap-card h-full rounded-lg bg-card p-6 text-foreground transition-colors hover:bg-muted/30"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-normal">{f.title}</h3>
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
          <h2 className="font-display text-4xl font-normal md:text-5xl">How Leap works</h2>
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
              className="leap-panel rounded-lg p-6"
            >
              <div className="font-display text-5xl font-normal text-secondary">{s.step}</div>
              <h3 className="mt-4 font-display text-xl font-normal">{s.title}</h3>
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
          className="leap-band-navy relative overflow-hidden rounded-xl p-10 md:p-16"
        >
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-normal text-white md:text-5xl">Ready to make the leap?</h2>
              <p className="mt-3 max-w-xl text-white/80">
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

      <footer className="container border-t border-border py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="none" />
            <span className="font-display font-normal text-foreground">Leap</span>
          </div>
          <div>© {new Date().getFullYear()} Leap. Built with 🐸 for students building their brand.</div>
        </div>
      </footer>
    </AnimatedPage>
  );
};

export default Home;
