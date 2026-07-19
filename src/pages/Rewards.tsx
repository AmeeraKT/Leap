import { useState } from "react";
import { Coffee, UtensilsCrossed, Ticket, Trophy, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Jumpy } from "@/components/Jumpy";
import { JumpyCelebration } from "@/components/JumpyCelebration";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProgression, xpProgressInLevel, type CelebrationEvent } from "@/lib/progression-store";
import { cn } from "@/lib/utils";

type RewardCategory = "food" | "event";

interface RewardItem {
  id: string;
  category: RewardCategory;
  title: string;
  discount: string;
  cost: number;
  icon: LucideIcon;
}

const REWARDS: RewardItem[] = [
  { id: "yochi-yoghurt", category: "food", title: "Yochi Yogurt", discount: "$5 off", cost: 200, icon: UtensilsCrossed },
  { id: "share-tea", category: "food", title: "Share Tea", discount: "$5 off", cost: 200, icon: Coffee },
  { id: "sushi-hub", category: "food", title: "Sushi Hub", discount: "$5 off", cost: 250, icon: UtensilsCrossed },
  { id: "hungry-jacks", category: "food", title: "Hungry Jacks", discount: "$5 off", cost: 250, icon: UtensilsCrossed },
  { id: "campus-cafe", category: "food", title: "Campus Brew Co.", discount: "$5 off", cost: 180, icon: Coffee },
  { id: "garden-cafe", category: "food", title: "Garden Lane Café", discount: "$8 off", cost: 320, icon: Coffee },
  { id: "networking", category: "event", title: "Networking event", discount: "$5 off next event", cost: 300, icon: Ticket },
  { id: "competition", category: "event", title: "Competition entry", discount: "$10 off next entry", cost: 500, icon: Trophy },
  { id: "career-fair", category: "event", title: "Career fair pass", discount: "$5 off ticket", cost: 280, icon: Ticket },
  { id: "hackathon", category: "event", title: "Hackathon weekend", discount: "$15 off entry", cost: 650, icon: Trophy },
];

const REDEEM_POINTS_KEY = "leap.rewards.points.v3";
const DEFAULT_REDEEM_POINTS = 1600;

function loadRedeemPoints(): number {
  try {
    const raw = localStorage.getItem(REDEEM_POINTS_KEY);
    if (raw == null) return DEFAULT_REDEEM_POINTS;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_REDEEM_POINTS;
  } catch {
    return DEFAULT_REDEEM_POINTS;
  }
}

function saveRedeemPoints(points: number) {
  try {
    localStorage.setItem(REDEEM_POINTS_KEY, String(points));
  } catch {
    /* ignore */
  }
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const Rewards = () => {
  const { xp, level } = useProgression();
  const [points, setPoints] = useState(loadRedeemPoints);
  const [tab, setTab] = useState<"food" | "event">("food");
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  const progress = xpProgressInLevel(xp);
  const xpToNext = Math.max(0, progress.needed - progress.current);
  const foodRewards = REWARDS.filter((r) => r.category === "food");
  const eventRewards = REWARDS.filter((r) => r.category === "event");

  const redeem = (reward: RewardItem) => {
    if (points < reward.cost) return;
    setPoints((p) => {
      const next = p - reward.cost;
      saveRedeemPoints(next);
      return next;
    });
    const voucherLabel =
      reward.category === "food" ? `${reward.title} voucher` : `${reward.title} deal`;
    setCelebration({
      id: `redeem-${reward.id}-${Date.now()}`,
      kind: "achievement",
      title: "Yay!",
      message: `You redeemed the ${voucherLabel}`,
      emoji: "🎁",
    });
  };

  const renderGrid = (items: RewardItem[]) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((reward) => {
        const Icon = reward.icon;
        const canRedeem = points >= reward.cost;
        return (
          <div
            key={reward.id}
            className="leap-card flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-normal leading-tight text-foreground">
                  {reward.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{reward.discount}</p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="font-display text-base tabular-nums text-coral">
                {reward.cost.toLocaleString()} pts
              </span>
              <Button
                size="sm"
                variant={canRedeem ? "default" : "secondary"}
                disabled={!canRedeem}
                onClick={() => redeem(reward)}
                className={cn(!canRedeem && "opacity-50")}
              >
                Redeem
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <AnimatedPage className="container space-y-10 overflow-x-hidden py-8 md:py-10">
      <JumpyCelebration event={celebration} onClose={() => setCelebration(null)} />

      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="leap-panel relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Redeem points
              </p>
              <p className="mt-1 font-display text-4xl tabular-nums text-foreground md:text-5xl">
                {points.toLocaleString()}{" "}
                <span className="text-2xl text-coral md:text-3xl">pts</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Separate from XP — spend these on vouchers and tickets.
              </p>
            </div>

            <div className="max-w-md space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                  Level {level} · {xp.toLocaleString()} XP
                </span>
                <span className="text-xs text-muted-foreground">
                  {xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to Level ${level + 1}` : "Max level band"}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-coral transition-[width] duration-500"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress.current.toLocaleString()} / {progress.needed.toLocaleString()} XP in this level
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 justify-center sm:flex md:pr-2">
            <Jumpy size="lg" animate="hop" />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-display text-2xl font-normal text-foreground md:text-3xl">
            Redeem your points
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Spend points on local perks and event discounts. Redemptions are preview-only for now.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "food" | "event")} className="w-full">
          <TabsList className="flex w-full sm:w-fit flex-wrap justify-start gap-1 rounded-2xl border border-border bg-surface p-1 font-display font-bold">
            <TabsTrigger
              value="food"
              className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
            >
              Food and beverage
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
            >
              Event tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="food" className="mt-6 focus-visible:outline-none">
            {renderGrid(foodRewards)}
          </TabsContent>
          <TabsContent value="event" className="mt-6 focus-visible:outline-none">
            {renderGrid(eventRewards)}
          </TabsContent>
        </Tabs>
      </motion.section>
    </AnimatedPage>
  );
};

export default Rewards;
