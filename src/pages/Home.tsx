import {
  ArrowRight,
  Target,
  BookOpen,
  Brain,
  Route,
  CheckCircle,
  Zap,
  Gift,
  ChevronRight,
  ChevronDown,
  Ticket,
  Coffee,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import jumpyThink from "@/assets/jumpy-think.png";
import jumpyTalk from "@/assets/jumpy-talk.png";
import jumpyBlink from "@/assets/jumpy-blink.png";
import jumpyHappy from "@/assets/jumpy-happy.png";
import { toast } from "sonner";
import { enterDemoAccount } from "@/lib/demo-account";

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
    body: "Show up and stand out. Join events, meet like-minded students, and get brand coaching that gets you noticed. Attend skill workshops hosted by student ambassadors near you!",
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
    body: "Turn your logs into LinkedIn posts and a portfolio that employers actually see. With just a click.",
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

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  return (
    <Link
      to={feature.to}
      className="group flex h-full flex-col rounded-2xl border border-border/60 bg-white p-4 text-foreground shadow-sm transition-transform hover:-translate-y-0.5 md:p-5"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-coral/10 text-coral">
        <feature.icon className="h-4 w-4" />
      </div>
      <h3 className="font-display text-lg font-normal leading-snug md:text-xl">{feature.title}</h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
        {feature.body}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-coral transition-transform group-hover:translate-x-1">
        Open
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function RecipeSuccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Full-viewport travel; ease-out bezier = fast start, slow settle
  const cardEase = cubicBezier(0.16, 1, 0.3, 1);
  const topX = useTransform(scrollYProgress, [0, 0.38], ["-100vw", "0vw"], {
    ease: cardEase,
  });
  const bottomX = useTransform(scrollYProgress, [0.35, 0.72], ["100vw", "0vw"], {
    ease: cardEase,
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (prefersReducedMotion) {
    return (
      <section id="features" className="leap-band-deep overflow-x-hidden">
        <div className="container py-16 md:py-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-normal text-white md:text-4xl">
              Recipe to your success
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative h-[200vh] leap-band-deep"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-x-hidden overflow-y-hidden py-6">
        <div className="container flex max-h-full flex-col gap-5 md:gap-6">
          <div className="mx-auto max-w-2xl shrink-0 text-center">
            <h2 className="font-display text-3xl font-normal text-white md:text-4xl">
              Recipe to your success
            </h2>
            <p className="mt-2 text-xs text-white/70 md:text-sm">
              Scroll to assemble your recipe
            </p>
          </div>

          {/* No overflow clip here — rows travel from true viewport edges */}
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="flex flex-col gap-3 sm:gap-4">
              <motion.div
                style={{ x: topX }}
                className="grid grid-cols-1 gap-3 opacity-100 sm:grid-cols-2 sm:gap-4"
              >
                {featureBands[0].map((f) => (
                  <FeatureCard key={f.title} feature={f} />
                ))}
              </motion.div>
              <motion.div
                style={{ x: bottomX }}
                className="grid grid-cols-1 gap-3 opacity-100 sm:grid-cols-2 sm:gap-4"
              >
                {featureBands[1].map((f) => (
                  <FeatureCard key={f.title} feature={f} />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs shrink-0">
            <div className="h-1 overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-coral"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const REWARD_LOOP_STEPS = [
  { icon: CheckCircle, label: "Complete tasks & attend events" },
  { icon: Zap, label: "Earn XP + points" },
  { icon: Gift, label: "Redeem rewards" },
] as const;

const MARQUEE_REWARDS = [
  "Event ticket discounts",
  "Yochi vouchers",
  "Café & F&B deals",
  "Competition entry discounts",
  "Networking event passes",
  "Exclusive workshops",
] as const;

const gamifyReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-120px" as const },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

function RewardsMarquee() {
  const items = [...MARQUEE_REWARDS, ...MARQUEE_REWARDS];

  return (
    <div className="marquee-mask mt-12 w-full overflow-hidden py-4">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {items.map((label, i) => {
          const isDupe = i >= MARQUEE_REWARDS.length;
          return (
            <span key={`${label}-${i}`} className="flex items-center" aria-hidden={isDupe || undefined}>
              <span className="mx-8 font-display text-3xl font-bold text-foreground md:text-5xl">
                {label}
              </span>
              <span className="mx-8 font-display text-3xl font-bold text-coral md:text-5xl" aria-hidden>
                •
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function GamifiedRewardsSection() {
  const [gifFailed, setGifFailed] = useState(false);

  return (
    <section className="overflow-x-hidden bg-coral/10 py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div {...gamifyReveal} className="space-y-6">
            <h2 className="font-display text-3xl font-normal text-foreground md:text-5xl">
              Your effort actually pays off
            </h2>
            <p className="max-w-lg text-base text-muted-foreground md:text-lg">
              Show up, log your wins, earn points — then cash them in for real rewards.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
              {REWARD_LOOP_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center gap-2 sm:flex-row sm:contents">
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                        delay: i * 0.12,
                      }}
                      className="flex w-full min-w-0 flex-1 items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold leading-snug text-foreground">{step.label}</p>
                    </motion.div>
                    {i < REWARD_LOOP_STEPS.length - 1 && (
                      <>
                        <ChevronRight className="hidden h-5 w-5 shrink-0 self-center text-coral sm:block" aria-hidden />
                        <ChevronDown className="h-5 w-5 shrink-0 text-coral sm:hidden" aria-hidden />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <Link to="/rewards">
              <Button variant="hero" size="sm" className="mt-2 gap-1.5">
                See rewards
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            {...gamifyReveal}
            transition={{ ...gamifyReveal.transition, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div
              className="pointer-events-none absolute inset-0 m-auto h-48 w-48 rounded-full bg-secondary/30 blur-3xl md:h-64 md:w-64"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md">
              {!gifFailed ? (
                <img
                  src="/assets/rewards-loop.gif"
                  alt="Gamified rewards loop — earn points and redeem perks"
                  className="aspect-[4/3] w-full object-cover"
                  onError={() => setGifFailed(true)}
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-muted/40 p-6 text-center">
                  <Jumpy size="sm" animate="hop" />
                  <p className="font-display text-lg text-foreground">Rewards loop GIF</p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Drop your file at <code className="text-coral">public/assets/rewards-loop.gif</code>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <RewardsMarquee />
    </section>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const startDemo = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    try {
      await enterDemoAccount();
      toast.success("Signed in as Alex Chen");
      navigate("/dashboard");
    } catch {
      toast.error("Couldn't start the demo. Try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
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
          <Link to="/signin">
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="min-w-0 flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-full w-full font-bold"
                  onClick={startDemo}
                  disabled={demoLoading}
                >
                  {demoLoading ? "Loading demo…" : "Try demo account"}
                </Button>
              </motion.div>
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

      {/* Features — sticky scroll: 2 white cards at a time, then continue to CTA */}
      <RecipeSuccessSection />

      <GamifiedRewardsSection />

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
                Jump into the demo as Alex Chen, a computer science student and explore!
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="default"
                    size="xl"
                    onClick={startDemo}
                    disabled={demoLoading}
                  >
                    {demoLoading ? "Loading demo…" : "Try demo account"}
                  </Button>
                </motion.div>
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
