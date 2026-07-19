import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import jumpyHappy from "@/assets/jumpy-happy.png";
import { cn } from "@/lib/utils";
import type { CelebrationEvent } from "@/lib/progression-store";

interface Props {
  event: CelebrationEvent | null;
  onClose: () => void;
}

export const JumpyCelebration = ({ event, onClose }: Props) => {
  if (!event) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="relative inline-block">
            <div className="absolute inset-0 scale-90 rounded-full bg-secondary/40 blur-3xl" aria-hidden />
            <img
              src={jumpyHappy}
              alt="Jumpy celebrating"
              className={cn("relative h-32 w-32 object-contain select-none animate-hop")}
              draggable={false}
            />
          </div>
          <div>
            <div className="text-4xl">{event.emoji ?? "🐸"}</div>
            <h2 className="mt-2 font-display text-2xl font-normal">{event.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{event.message}</p>
          </div>
          <Button variant="hero" className="rounded-full" onClick={onClose}>
            Keep hopping!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
