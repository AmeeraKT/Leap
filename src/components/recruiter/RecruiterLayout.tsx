import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, LogOut, Search, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Jumpy } from "@/components/Jumpy";
import { AnimatedPage } from "@/components/AnimatedPage";
import { RecruiterProvider, useRecruiter } from "./RecruiterContext";
import type { RecruiterPlan } from "./RecruiterContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumGate } from "./PremiumGate";
import { students } from "@/data/students";
import { matchStudents } from "@/lib/recruiter-matching";
import { StudentCard } from "./StudentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRecruiterDemoPlan, setRecruiterDemoPlan } from "@/lib/recruiter-plan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function RecruiterNavLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={({ isActive: activeFromRouter }) =>
        cn(
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors",
          activeFromRouter || isActive
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      {label}
      <span className="sr-only">recruiter link</span>
    </NavLink>
  );
}

function RecruiterShellInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium, plan, setPlan } = useRecruiter();
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const chatTitle = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean).slice(-1)[0];
    if (!seg) return "Recruiter Chat";
    return `Recruiter Chat • ${seg}`;
  }, [location.pathname]);

  const matched = useMemo(() => matchStudents(students, submitted), [submitted]);

  const upgrade = () => {
    setPlan("premium");
    setRecruiterDemoPlan("premium");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <AnimatedPage className="min-h-screen bg-background overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/recruiter/dashboard" className="flex items-center gap-2">
              <Jumpy size="xs" animate="none" />
              <span className="font-display text-xl font-normal tracking-tight text-foreground">RECRUITER</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <RecruiterNavLink to="/recruiter/dashboard" label="Dashboard" />
            <RecruiterNavLink to="/recruiter/discover" label="Discover" />
            <RecruiterNavLink to="/recruiter/shortlist" label="Shortlist" />
            <RecruiterNavLink to="/recruiter/messages" label="Messages" />
            <RecruiterNavLink to="/recruiter/analytics" label="Analytics" />
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!isPremium) upgrade();
              }}
              className={cn(
                "hidden rounded-full border px-3 py-1 text-xs font-semibold md:inline-flex md:items-center md:gap-1.5",
                isPremium
                  ? "border-coral/30 bg-secondary/25 text-coral"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {plan === "premium" ? "Premium plan" : "Free plan · Upgrade"}
              {!isPremium && <ArrowUpRight className="h-3.5 w-3.5" />}
            </button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hidden text-muted-foreground hover:text-destructive md:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="border-b border-border/70 px-3 py-2 md:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <RecruiterNavLink to="/recruiter/dashboard" label="Dashboard" />
          <RecruiterNavLink to="/recruiter/discover" label="Discover" />
          <RecruiterNavLink to="/recruiter/shortlist" label="Shortlist" />
          <RecruiterNavLink to="/recruiter/messages" label="Messages" />
          <RecruiterNavLink to="/recruiter/analytics" label="Analytics" />
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <main className="relative">
        <Outlet />
      </main>

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Open recruiter chat"
        className={cn(
          "group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-md",
          "bg-[#5BD2D6] transition-colors duration-300 ease-out",
          "hover:bg-[#FF7657] focus-visible:bg-[#FF7657]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7657] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Jumpy size="xs" animate="hop" />
        <span className="sr-only">Open chat</span>
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="fixed bottom-20 right-5 z-50 h-[75vh] w-[30rem] max-h-[44rem] max-w-[calc(100vw-1.25rem)]"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/30 text-coral">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-bold">Jumpy matching assistant</div>
                    <div className="truncate text-xs text-muted-foreground">{chatTitle}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  Tell me the talent profile you need and I will find strong student matches.
                </p>

                <PremiumGate
                  mode="badge"
                  fallback={
                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-coral">
                        Premium
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to run AI matching here and in the Dashboard hero.
                      </p>
                    </div>
                  }
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(query.trim());
                    }}
                    className="mb-4 flex items-center gap-2"
                  >
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. second-year AI student who shipped a project"
                    />
                    <Button type="submit" variant="hero" size="sm" disabled={!isPremium}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </PremiumGate>

                {submitted && isPremium && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {matched.length} match{matched.length === 1 ? "" : "es"}
                    </p>
                    {matched.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
                        No direct matches yet. Try broader keywords.
                      </div>
                    ) : (
                      matched.map((student) => (
                        <StudentCard key={student.id} student={student} variant="grid" />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}

export function RecruiterLayout() {
  const [searchParams] = useSearchParams();
  const rawPlan = searchParams.get("plan");
  const stored = getRecruiterDemoPlan();
  const initialPlan: RecruiterPlan =
    rawPlan === "premium" || rawPlan === "free"
      ? (rawPlan as RecruiterPlan)
      : stored ?? "free";

  return (
    <RecruiterProvider initialPlan={initialPlan}>
      <RecruiterShellInner />
    </RecruiterProvider>
  );
}
