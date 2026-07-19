import { useState } from "react";
import { Link } from "react-router-dom";
import jumpyDefault from "@/assets/jumpy-default.png";
import jumpyHappy from "@/assets/jumpy-happy.png";
import { cn } from "@/lib/utils";

/** Floating Jumpy launcher — opens Career Vision chat tab. */
export const JumpyChatLauncher = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/career-vision?tab=coach"
      aria-label="Open Jumpy buddy chat"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-md",
        "bg-[#5BD2D6] transition-colors duration-300 ease-out",
        "hover:bg-[#FF7657] focus-visible:bg-[#FF7657]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7657] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {/* Chat bubble */}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-2xl rounded-br-sm bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-md",
          "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hovered
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0",
        )}
        aria-hidden={!hovered}
      >
        Wanna chat?
        <span className="absolute -bottom-1 right-3 h-2 w-2 rotate-45 bg-foreground" />
      </span>

      <img
        src={hovered ? jumpyHappy : jumpyDefault}
        alt=""
        className="jumpy-launcher-hop h-12 w-12 object-contain select-none"
        draggable={false}
      />
    </Link>
  );
};
