import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Jumpy } from "@/components/Jumpy";

interface Props {
  message: string;
  ctaLabel?: string;
  to?: string;
  /** e.g. "5 unshared" — shown bold/black before the second sentence */
  unsharedLabel?: string;
}

export const JumpyNudge = ({ message, ctaLabel, to, unsharedLabel }: Props) => {
  const draftCue = "Want me to draft a post?";
  const hasDraftCue = message.includes(draftCue);
  const beforeDraft = hasDraftCue ? message.slice(0, message.indexOf(draftCue)).trimEnd() : message;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-coral/40 bg-coral/10 p-4">
      <Jumpy size="xs" animate="float" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {hasDraftCue && unsharedLabel ? (
            <>
              <span>{beforeDraft} </span>
              <span>{draftCue}</span>
              <span className="mx-2 inline-block h-3.5 w-px align-middle bg-foreground/30" aria-hidden />
              <span className="font-bold text-coral">{unsharedLabel}</span>
            </>
          ) : (
            message
          )}
        </p>
      </div>
      {ctaLabel && to && (
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-coral px-4 py-2 text-xs font-bold text-coral-foreground transition-transform hover:scale-105"
        >
          {ctaLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
};
