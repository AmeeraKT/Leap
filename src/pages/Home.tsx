import {
  ArrowRight,
  Target,
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
import jumpyThink from "@/assets/jumpy-think.png";
import jumpyTalk from "@/assets/jumpy-talk.png";
import jumpyBlink from "@/assets/jumpy-blink.png";
import jumpyHappy from "@/assets/jumpy-happy.png";

const features = [
  {
    icon: Target,
    title: "Quiz & pathway plans",
    body: "Take a quick quiz, get your top 3 career matches, and compare plans built around your goals.",
    to: "/quiz",
  },
  {
    icon: Route,
    title: "Quest roadmap",
    body: "A six-stage career map with milestones, checklists, coaching and job predictions.",
    to: "/roadmap",
  },
  {
    icon: BookOpen,
    title: "Journey log",
    body: "Log your wins, draft social posts, keep your streak, and earn XP as your brand grows.",
    to: "/journey",
  },
  {
    icon: Brain,
    title: "Career Vision",
    body: "AI job matches, resume feedback, and Jumpy on call when you're stuck.",
    to: "/career-vision",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "EXPLORE",
    body: "Not sure what career fits? Jumpy matches you with events, communities and paths that actually suit you.",
    image: jumpyThink,
    imageAlt: "Jumpy thinking about career paths",
    imageLeft: false,
  },
  {
    step: "02",
    title: "ENGAGE",
    body: "Show up and stand out. Join events, meet like-minded students, and get brand coaching that gets you noticed.",
    image: jumpyTalk,
    imageAlt: "Jumpy talking and engaging",
    imageLeft: true,
  },
  {
    step: "03",
    title: "CAPTURE",
    body: "Never blank in an interview again. Log every event, project and connection as career-ready proof.",
    image: jumpyBlink,
    imageAlt: "Jumpy capturing a moment",
    imageLeft: false,
  },
  {
    step: "04",
    title: "SHOWCASE",
    body: "Turn your logs into LinkedIn posts and a portfolio that employers actually see.",
    image: jumpyHappy,
    imageAlt: "Jumpy showcasing wins",
    imageLeft: true,
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

const revealEase = [0.16, 1, 0.3, 1] as const;

const revealViewport = { once: true, margin: "-120px" as const };

const textReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: revealViewport,
  transition: { duration: 0.9, ease: revealEase },
};

const imageReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: revealViewport,
  transition: { duration: 0.9, ease: revealEase, delay: 0.15 },
};

const featureBands = [
  [features[0], features[1]],
  [features[2], features[3]],
] as const;

const Home = () => {
  return (
    <AnimatedPage className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-2xl font-normal text-foreground">LEAP</span>
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
          className="flex w-full max-w-lg flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl font-normal leading-[1.02] text-foreground md:text-6xl lg:text-7xl"
          >
            <span className="block">LEVEL UP your employability,</span>
            <span className="block">
              the <span className="text-coral">FUN way!</span>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg leading-relaxed text-muted-foreground">
            Stop applying blindly. Start standing out.
            Discover your career path, build your brand, and grow with a student community where noone gatekeeps.
            
            With Jumpy your career sidekick!
          </motion.p>

          <motion.div variants={itemVariants} className="flex w-full flex-col gap-3">
            <div className="flex w-full items-stretch gap-3">
              <Link to="/quiz" className="shrink-0">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero" size="xl">
                    Get started
                  </Button>
                </motion.div>
              </Link>
              <Link to="/quiz" className="min-w-0 flex-1">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-full w-full">
                  <Button variant="outline" size="lg" className="h-full w-full font-bold">
                    Try demo account
                  </Button>
                </motion.div>
              </Link>
            </div>

            <Link to="/waitlist" className="block w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button variant="coral" size="lg" className="w-full font-bold">
                  Join waitlist
                </Button>
              </motion.div>
            </Link>
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

      {/* How LEAP works */}
      <section id="how" className="overflow-x-hidden">
        <div className="container py-16 md:py-24">
          <motion.div
            {...textReveal}
            className="mx-auto mb-8 max-w-2xl text-center md:mb-16"
          >
            <h2 className="font-display text-4xl font-normal md:text-5xl">How LEAP works</h2>
            <p className="mt-3 text-muted-foreground">Four hops from sign-up to career momentum.</p>
          </motion.div>
        </div>

        {howItWorks.map((phase) => (
          <div key={phase.step} className="container py-16 md:py-24 lg:py-32">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <motion.div
                {...textReveal}
                className={
                  phase.imageLeft
                    ? "order-2 space-y-4 md:order-2"
                    : "order-2 space-y-4 md:order-1"
                }
              >
                <p className="text-sm font-semibold tracking-widest text-muted-foreground">
                  {phase.step}
                </p>
                <h3 className="font-display text-4xl font-normal uppercase leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
                  {phase.title}
                </h3>
                <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                  {phase.body}
                </p>
              </motion.div>

              <motion.div
                {...imageReveal}
                className={
                  phase.imageLeft
                    ? "order-1 relative flex items-center justify-center md:order-1"
                    : "order-1 relative flex items-center justify-center md:order-2"
                }
              >
                <div className="absolute inset-0 -z-10 m-auto h-56 w-56 rounded-full bg-secondary/30 blur-3xl md:h-80 md:w-80" />
                <img
                  src={phase.image}
                  alt={phase.imageAlt}
                  className="relative h-44 w-44 object-contain select-none md:h-64 md:w-64 lg:h-72 lg:w-72"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="leap-band-deep overflow-x-hidden">
        <div className="container py-16 md:py-24">
          <motion.div {...textReveal} className="mx-auto mb-12 max-w-2xl text-center md:mb-20">
            <h2 className="font-display text-4xl font-normal text-white md:text-5xl">
              Recipe to your success
            </h2>
          </motion.div>

          <div className="space-y-16 md:space-y-24">
            {featureBands.map((band, bandIndex) => (
              <div
                key={bandIndex}
                className="grid gap-12 md:grid-cols-2 md:gap-20"
              >
                {band.map((f, featureIndex) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={revealViewport}
                    transition={{
                      duration: 0.9,
                      ease: revealEase,
                      delay: featureIndex * 0.12,
                    }}
                  >
                    <Link
                      to={f.to}
                      className="group block space-y-4 text-white transition-opacity hover:opacity-90"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-3xl font-normal md:text-4xl">
                        {f.title}
                      </h3>
                      <p className="max-w-md text-base leading-relaxed text-white/75 md:text-lg">
                        {f.body}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition-transform group-hover:translate-x-1">
                        Open
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="container pb-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="leap-band-deep relative overflow-hidden rounded-xl p-10 md:p-16"
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
          <div>© {new Date().getFullYear()} LEAP. Built for students who want to standout.</div>
        </div>
      </footer>
    </AnimatedPage>
  );
};

export default Home;
