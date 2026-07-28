import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useRecruiter } from "./RecruiterContext";

export type PremiumGateMode = "badge" | "blur" | "lock";

function LockedState({ mode }: { mode: PremiumGateMode }) {
  if (mode === "badge") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-2 text-sm font-semibold text-coral">
        <Lock className="h-4 w-4" />
        Premium
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
      <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-secondary/30 px-4 py-2">
        <Lock className="h-4 w-4 text-coral" />
        <span className="text-sm font-semibold text-coral">Premium</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Upgrade to unlock</p>
    </div>
  );
}

export function PremiumGate({
  children,
  fallback,
  mode = "lock",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: PremiumGateMode;
}) {
  const { isPremium } = useRecruiter();

  if (isPremium) return <>{children}</>;

  if (mode === "blur") {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none">
          <div className="filter blur-sm opacity-70">{children}</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {fallback ?? <LockedState mode="lock" />}
        </div>
      </div>
    );
  }

  return <>{fallback ?? <LockedState mode={mode} />}</>;
}

