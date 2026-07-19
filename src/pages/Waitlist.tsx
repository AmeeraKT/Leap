import { FormEvent, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedPage } from "@/components/AnimatedPage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  submitWaitlist,
  validateWaitlistClient,
  WAITLIST_DEGREES,
  WAITLIST_MAJORS,
  WAITLIST_ONLINE_PRESENCE,
  WAITLIST_YEARS,
  type WaitlistDegree,
  type WaitlistFieldErrors,
  type WaitlistMajor,
  type WaitlistOnlinePresence,
  type WaitlistYear,
} from "@/lib/waitlist";

const Waitlist = () => {
  const navigate = useNavigate();
  const formId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState<WaitlistYear | "">("");
  const [degree, setDegree] = useState<WaitlistDegree | "">("");
  const [majors, setMajors] = useState<WaitlistMajor[]>([]);
  const [university, setUniversity] = useState("");
  const [onlinePresence, setOnlinePresence] = useState<WaitlistOnlinePresence | "">("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<WaitlistFieldErrors>({});

  const toggleMajor = (major: WaitlistMajor, checked: boolean) => {
    setMajors((prev) => {
      if (checked) {
        if (prev.includes(major)) return prev;
        if (prev.length >= 2) {
          setErrors((e) => ({ ...e, majors: "Select at most 2 majors." }));
          return prev;
        }
        setErrors((e) => {
          const next = { ...e };
          delete next.majors;
          return next;
        });
        return [...prev, major];
      }
      return prev.filter((m) => m !== major);
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const clientResult = validateWaitlistClient({
      name,
      email,
      year: year || undefined,
      degree: degree || undefined,
      majors,
      university: university || null,
      onlinePresence: onlinePresence || null,
      website,
    });

    if (clientResult.ok === false) {
      setErrors(clientResult.fields);
      return;
    }

    setLoading(true);
    try {
      const result = await submitWaitlist(clientResult.data);
      if (result.ok === false) {
        if (result.fields) setErrors(result.fields);
        toast.error(result.error);
        return;
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setYear("");
      setDegree("");
      setMajors([]);
      setUniversity("");
      setOnlinePresence("");
      setWebsite("");
      toast.success("You're on the list! We'll be in touch soon.");
    } catch {
      toast.error("Unable to join the waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key: keyof WaitlistFieldErrors) =>
    errors[key] ? (
      <p id={`${formId}-${key}-error`} className="text-sm text-destructive" role="alert">
        {errors[key]}
      </p>
    ) : null;

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

      <section className="container grid items-start gap-10 py-12 md:grid-cols-2 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="space-y-5 md:sticky md:top-28"
        >
          <h1 className="font-display text-5xl font-normal leading-[1.02] text-foreground md:text-6xl">
            Be first in line for <span className="text-coral">Leap</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Join the waitlist for launch updates. Signing up is just a small step for you, but one
            giant LEAP for your success.
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
            <div className="relative space-y-4 text-center">
              <Jumpy size="lg" animate="hop" glow />
              <h2 className="font-display text-3xl font-normal text-foreground">You&apos;re in</h2>
              <p className="text-muted-foreground">
                Thanks for joining the Leap waitlist. We&apos;ll reach out when it&apos;s your turn.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
                  Add another signup
                </Button>
                <Button type="button" variant="hero" asChild>
                  <Link to="/">Back home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form className="relative space-y-5" onSubmit={onSubmit} noValidate>
              {/* Honeypot — hidden from users, left for bots */}
              <div
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                aria-hidden="true"
              >
                <label htmlFor={`${formId}-website`}>Website</label>
                <input
                  id={`${formId}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-name`}>
                  Name <span className="text-coral">*</span>
                </Label>
                <Input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                  placeholder="Your full name"
                  className="h-12 rounded-lg"
                />
                {fieldError("name")}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-email`}>
                  Email <span className="text-coral">*</span>
                </Label>
                <Input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                  placeholder="you@school.edu"
                  className="h-12 rounded-lg"
                />
                {fieldError("email")}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-year`}>
                  Year of study <span className="text-coral">*</span>
                </Label>
                <Select
                  value={year}
                  onValueChange={(v) => setYear(v as WaitlistYear)}
                >
                  <SelectTrigger
                    id={`${formId}-year`}
                    className="h-12 rounded-lg"
                    aria-invalid={Boolean(errors.year)}
                    aria-describedby={errors.year ? `${formId}-year-error` : undefined}
                  >
                    <SelectValue placeholder="Select year…" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAITLIST_YEARS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("year")}
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">
                  Degree <span className="text-coral">*</span>
                </legend>
                <RadioGroup
                  value={degree}
                  onValueChange={(v) => setDegree(v as WaitlistDegree)}
                  className="grid grid-cols-4 gap-2"
                  aria-describedby={errors.degree ? `${formId}-degree-error` : undefined}
                >
                  {WAITLIST_DEGREES.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`${formId}-degree-${option}`}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-3 text-center text-xs font-normal leading-snug transition-colors hover:bg-muted/40 sm:flex-row sm:text-sm",
                        degree === option && "border-primary/40 bg-muted/30",
                      )}
                    >
                      <RadioGroupItem id={`${formId}-degree-${option}`} value={option} />
                      {option}
                    </Label>
                  ))}
                </RadioGroup>
                {fieldError("degree")}
              </fieldset>

              <div className="space-y-2">
                <Label id={`${formId}-majors-label`}>
                  Majors <span className="text-coral">*</span>
                  <span className="ml-1 font-normal text-muted-foreground">(1–2)</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto min-h-12 w-full justify-between rounded-lg px-3 py-2 text-left font-normal"
                      aria-labelledby={`${formId}-majors-label`}
                      aria-invalid={Boolean(errors.majors)}
                      aria-describedby={errors.majors ? `${formId}-majors-error` : undefined}
                    >
                      <span className={cn(!majors.length && "text-muted-foreground")}>
                        {majors.length
                          ? majors.join(", ")
                          : "Select up to 2 majors…"}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto">
                    {WAITLIST_MAJORS.map((major) => {
                      const checked = majors.includes(major);
                      const disabled = !checked && majors.length >= 2;
                      return (
                        <DropdownMenuCheckboxItem
                          key={major}
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={(next) => toggleMajor(major, next === true)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {major}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                {majors.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {majors.map((major) => (
                      <li
                        key={major}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground"
                      >
                        <Check className="h-3 w-3 text-secondary" />
                        {major}
                      </li>
                    ))}
                  </ul>
                )}
                {fieldError("majors")}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-university`}>
                  University{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id={`${formId}-university`}
                  name="university"
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  aria-invalid={Boolean(errors.university)}
                  aria-describedby={errors.university ? `${formId}-university-error` : undefined}
                  placeholder="e.g. University of Queensland"
                  className="h-12 rounded-lg"
                />
                {fieldError("university")}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-presence`}>
                  Professional online presence <span className="text-coral">*</span>
                </Label>
                <Select
                  value={onlinePresence || undefined}
                  onValueChange={(v) => setOnlinePresence(v as WaitlistOnlinePresence)}
                >
                  <SelectTrigger
                    id={`${formId}-presence`}
                    className={cn(
                      "h-12 rounded-lg",
                      !onlinePresence && "text-muted-foreground",
                    )}
                    aria-invalid={Boolean(errors.onlinePresence)}
                    aria-describedby={
                      errors.onlinePresence ? `${formId}-onlinePresence-error` : undefined
                    }
                  >
                    <SelectValue placeholder="How often do you post on LinkedIn?" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAITLIST_ONLINE_PRESENCE.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("onlinePresence")}
              </div>

              {errors.form && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.form}
                </p>
              )}

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
          )}
        </motion.div>
      </section>
    </AnimatedPage>
  );
};

export default Waitlist;
