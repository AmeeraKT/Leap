import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type Audience = "students" | "recruiters";

const buttonBase =
  "rounded-full px-5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2";

export function LandingAudienceToggle({ active }: { active?: Audience }) {
  const location = useLocation();

  const resolvedActive: Audience =
    active ??
    (location.pathname.startsWith("/recruiters") ? "recruiters" : "students");

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
      <Link
        to="/"
        className={cn(
          buttonBase,
          resolvedActive === "students"
            ? "bg-black text-white"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        For Students
      </Link>
      <Link
        to="/recruiters"
        className={cn(
          buttonBase,
          resolvedActive === "recruiters"
            ? "bg-black text-white"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        For Recruiters
      </Link>
    </div>
  );
}

