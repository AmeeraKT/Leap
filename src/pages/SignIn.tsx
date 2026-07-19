import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_EMAIL, DEMO_PASSWORD, enterDemoAccount } from "@/lib/demo-account";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      toast.success("Welcome back 🐸");
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const onDemo = async () => {
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
      <header className="container flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-xl font-normal">LEAP</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="container flex max-w-md flex-col gap-6 py-8 md:py-16">
        <div>
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="font-display text-3xl font-normal md:text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back — hop into your dashboard.
          </p>
        </div>

        <form onSubmit={onSubmit} className="leap-panel space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@uni.edu.au"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative text-center text-xs text-muted-foreground">
          <span className="bg-background px-2">or</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full font-bold"
          onClick={onDemo}
          disabled={demoLoading}
        >
          {demoLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Loading demo…
            </>
          ) : (
            "Try demo account"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/quiz" className="font-semibold text-coral hover:underline">
            Take the quiz
          </Link>
        </p>
      </div>
    </AnimatedPage>
  );
};

export default SignIn;
