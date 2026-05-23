import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
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
          <Jumpy size="md" animate="hop" glow />
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
