import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedPage } from "@/components/AnimatedPage";
import { toast } from "sonner";
import {
  isValidWaitlistEmail,
  LAUNCHLIST_FORM_KEY,
  LAUNCHLIST_SUBMIT_URL,
  sanitizeWaitlistEmail,
  sanitizeWaitlistName,
} from "@/lib/waitlist";

function launchlistActionWithReferrals(): string {
  const params = new URLSearchParams(window.location.search);
  const query = params.toString();
  return query ? `${LAUNCHLIST_SUBMIT_URL}?${query}` : LAUNCHLIST_SUBMIT_URL;
}

const Waitlist = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const safeName = sanitizeWaitlistName(name);
    const safeEmail = sanitizeWaitlistEmail(email);

    setName(safeName);
    setEmail(safeEmail);

    if (!safeEmail) {
      toast.error("Email is required.");
      return;
    }
    if (!isValidWaitlistEmail(safeEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const form = formRef.current ?? event.currentTarget;
    form.setAttribute("action", launchlistActionWithReferrals());

    // LaunchList's DIY flow expects a classic browser POST with named inputs
    // (not fetch). Always send both fields so name is persisted when provided.
    const nameInput = form.elements.namedItem("name");
    const emailInput = form.elements.namedItem("email");
    if (nameInput instanceof HTMLInputElement) nameInput.value = safeName;
    if (emailInput instanceof HTMLInputElement) emailInput.value = safeEmail;

    setLoading(true);

    // Native submit → hidden iframe, then show in-app success (docs-compatible).
    HTMLFormElement.prototype.submit.call(form);

    window.setTimeout(() => {
      setName("");
      setEmail("");
      setSubmitted(true);
      setLoading(false);
      toast.success("You're on the list! We'll be in touch soon. 🐸");
    }, 900);
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="float" />
            <span className="font-display text-lg font-normal">Join the waitlist</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="space-y-5"
        >
          <h1 className="font-display text-5xl font-normal leading-[1.02] text-foreground md:text-6xl">
            Be first in line for <span className="text-coral">Leap</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Join the waitlist for launch updates. Signing up is just a small step for you, but one giant LEAP for your success. 
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Jumpy size="md" animate="hop" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Jumpy will hop over when it&apos;s your turn.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.08 }}
          className="leap-card relative overflow-hidden rounded-lg bg-card p-6 md:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/25 blur-3xl" />

          {submitted ? (
            <div className="space-y-4 text-center">
              <Jumpy size="lg" animate="hop" glow />
              <h2 className="font-display text-3xl font-normal text-foreground">You&apos;re in</h2>
              <p className="text-muted-foreground">
                Thanks for joining. Check your inbox if LaunchList sends a confirmation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
                  Add another email
                </Button>
                <Button type="button" variant="hero" asChild>
                  <Link to="/">Back home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <iframe
                title="LaunchList submission"
                name="launchlist-submit"
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />
              <form
                ref={formRef}
                className="launchlist-form relative space-y-5"
                action={LAUNCHLIST_SUBMIT_URL}
                method="POST"
                target="launchlist-submit"
                onSubmit={onSubmit}
                noValidate
                data-key-id={LAUNCHLIST_FORM_KEY}
              >
                <div className="space-y-2">
                  <Label htmlFor="waitlist-name">
                    Name <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="waitlist-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setName((v) => sanitizeWaitlistName(v))}
                      placeholder="Your name"
                      className="h-12 rounded-lg pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">
                    Email <span className="text-coral">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="waitlist-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmail((v) => sanitizeWaitlistEmail(v))}
                      placeholder="you@school.edu"
                      className="h-12 rounded-lg pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining…
                    </>
                  ) : (
                    "Join waitlist"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By joining, you agree to receive launch updates from Leap. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </section>
    </AnimatedPage>
  );
};

export default Waitlist;
