import { useNavigate } from "react-router-dom";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LandingAudienceToggle } from "@/components/LandingAudienceToggle";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { setRecruiterDemoPlan, type RecruiterDemoPlan } from "@/lib/recruiter-plan";
import { ArrowRight } from "lucide-react";

const Recruiters = () => {
  const navigate = useNavigate();

  const startDemo = (plan: RecruiterDemoPlan) => {
    setRecruiterDemoPlan(plan);
    navigate("/recruiter/dashboard");
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="none" />
            <span className="font-display text-2xl font-normal text-foreground">LEAP</span>
          </div>

          <div className="flex items-center gap-2">
            <LandingAudienceToggle active="recruiters" />
            <ThemeToggle />
            <a href="/signin">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </a>
          </div>
        </div>
      </header>

      <section className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          className="flex w-full max-w-lg flex-col gap-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">For Recruiters</p>
          <h1 className="font-display text-4xl font-normal leading-[1.02] text-foreground md:text-5xl lg:text-6xl">
            Find the students you're already looking for.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            LEAP surfaces proactive tech students through real projects and short-form video, so you
            see who they are, not just what they claim. AI matching helps you find fit faster.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => startDemo("free")}>
              Try demo — Free
            </Button>
            <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => startDemo("premium")}>
              Try demo — Premium
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
          <Jumpy size="xl" animate="hop" glow />
        </motion.div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-3xl font-normal md:text-4xl">The hiring problem, now amplified</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            AI-generated CVs are polished but often indistinguishable. Fakes look real, and it's harder
            to assess signal, drive, and proof of work from static resumes alone.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["2 in 5 recruiters say AI CVs make assessment harder", "25 days avg. time to fill", "$17k avg. cost per hire"].map((chip) => (
              <span key={chip} className="rounded-full border border-coral/25 bg-secondary/25 px-3 py-1 text-xs font-semibold">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Students document projects and growth with short-form evidence.",
            "LEAP builds a live pool of proactive tech talent with real proof.",
            "Describe your ideal candidate and AI matching finds fit fast.",
          ].map((step, idx) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-xs font-semibold tracking-wide text-coral">0{idx + 1}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="container py-8 md:py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Free</p>
            <h3 className="mt-2 font-display text-2xl font-normal">Get started and explore talent</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Limited student search</li>
              <li>• View limited profiles</li>
              <li>• 5 InMails</li>
            </ul>
            <Button className="mt-5 w-full" variant="outline" onClick={() => startDemo("free")}>
              Try demo — Free
            </Button>
          </div>

          <div className="rounded-2xl border border-coral/30 bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">Premium</p>
            <h3 className="mt-2 font-display text-2xl font-normal">Go deeper. Hire with confidence</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Advanced search and filters</li>
              <li>• Full profiles and evidence</li>
              <li>• AI-powered matching</li>
              <li>• Unlimited + priority InMail</li>
              <li>• Insights and analytics</li>
            </ul>
            <Button className="mt-5 w-full" variant="hero" onClick={() => startDemo("premium")}>
              Try demo — Premium
            </Button>
          </div>
        </div>
      </section>

      <section className="container pb-16 pt-8 md:pb-20 md:pt-10">
        <div className="leap-band-deep rounded-2xl p-6 md:p-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-3xl font-normal text-white md:text-4xl">
                Real students. Real evidence. Faster hires.
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Start free or unlock premium tools for end-to-end recruiter workflow.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              <Button variant="outline" className="bg-background/90" onClick={() => startDemo("free")}>
                Try demo — Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="hero" onClick={() => startDemo("premium")}>
                Try demo — Premium
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default Recruiters;

