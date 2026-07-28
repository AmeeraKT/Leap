import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

export type RecruiterPlan = "free" | "premium";

export type RecruiterMessage = {
  id: string;
  from: "recruiter" | "student";
  text: string;
  createdAt: number;
};

type RecruiterContextValue = {
  plan: RecruiterPlan;
  isPremium: boolean;
  setPlan: (plan: RecruiterPlan) => void;
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  messages: Record<string, RecruiterMessage[]>;
  sendMessage: (
    studentId: string,
    text: string,
    from?: RecruiterMessage["from"],
  ) => boolean;
  inMailUsed: number;
};

const RecruiterContext = createContext<RecruiterContextValue | null>(null);

export function RecruiterProvider({
  children,
  initialPlan = "free",
}: {
  children: ReactNode;
  initialPlan?: RecruiterPlan;
}) {
  const [plan, setPlan] = useState<RecruiterPlan>(initialPlan);
  const isPremium = plan === "premium";

  const [shortlist, setShortlist] = useState<string[]>([]);
  const toggleShortlist = (id: string) => {
    setShortlist((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (!isPremium && prev.length >= 5) {
        toast.error("Free plan is limited to 5 shortlisted students. Upgrade for unlimited.");
        return prev;
      }
      return [...prev, id];
    });
  };
  const isShortlisted = (id: string) => shortlist.includes(id);

  const [messages, setMessages] = useState<Record<string, RecruiterMessage[]>>({});
  const inMailUsed = useMemo(
    () =>
      Object.values(messages).reduce(
        (sum, arr) => sum + arr.filter((msg) => msg.from === "recruiter").length,
        0,
      ),
    [messages],
  );

  const sendMessage = (
    studentId: string,
    text: string,
    from: RecruiterMessage["from"] = "recruiter",
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    if (from === "recruiter" && !isPremium && inMailUsed >= 5) {
      toast.error("Free plan includes 5 InMails. Upgrade for unlimited + priority messaging.");
      return false;
    }
    const msg: RecruiterMessage = {
      id: `m-${Date.now()}`,
      from,
      text: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => ({
      ...prev,
      [studentId]: [...(prev[studentId] ?? []), msg],
    }));
    return true;
  };

  const value = useMemo<RecruiterContextValue>(
    () => ({
      plan,
      isPremium,
      setPlan,
      shortlist,
      toggleShortlist,
      isShortlisted,
      messages,
      sendMessage,
      inMailUsed,
    }),
    [inMailUsed, isPremium, messages, plan, shortlist],
  );

  return <RecruiterContext.Provider value={value}>{children}</RecruiterContext.Provider>;
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext);
  if (!ctx) throw new Error("useRecruiter must be used within RecruiterProvider");
  return ctx;
}

