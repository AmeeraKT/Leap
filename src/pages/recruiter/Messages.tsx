import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { students } from "@/data/students";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const seedReplies: Record<string, string[]> = {
  "st-alex-chen": ["Thanks for reaching out!", "Happy to share my latest project notes if helpful."],
  "st-samira-khan": ["Great to connect.", "I'm especially interested in product + analytics roles."],
};

const RecruiterMessages = () => {
  const { messages, sendMessage, inMailUsed, isPremium } = useRecruiter();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("student") ?? "";
  const [activeId, setActiveId] = useState<string>("");
  const [draft, setDraft] = useState("");
  const [mobileThread, setMobileThread] = useState(false);

  const conversationIds = useMemo(() => {
    const fromState = Object.keys(messages);
    const ids = new Set<string>(fromState);
    if (preselectedId) ids.add(preselectedId);
    return [...ids];
  }, [messages, preselectedId]);

  useEffect(() => {
    if (!activeId && conversationIds.length > 0) setActiveId(conversationIds[0]);
  }, [activeId, conversationIds]);

  useEffect(() => {
    if (preselectedId) setActiveId(preselectedId);
  }, [preselectedId]);

  const activeStudent = students.find((s) => s.id === activeId);
  const thread = useMemo(() => {
    if (!activeId) return [];
    const seeded =
      seedReplies[activeId]?.map((text, i) => ({
        id: `seed-${activeId}-${i}`,
        from: "student" as const,
        text,
        createdAt: 0,
      })) ?? [];
    return [...seeded, ...(messages[activeId] ?? [])];
  }, [activeId, messages]);

  const send = () => {
    if (!activeId || !draft.trim()) return;
    const ok = sendMessage(activeId, draft, "recruiter");
    if (!ok) return;
    const justSent = draft.trim();
    setDraft("");
    setTimeout(() => {
      sendMessage(activeId, `Thanks! Saw your note on "${justSent.slice(0, 28)}..." — keen to chat more.`, "student");
    }, 750);
  };

  if (conversationIds.length === 0) {
    return (
      <AnimatedPage className="container py-10">
        <h1 className="font-display text-3xl font-normal md:text-4xl">Messages</h1>
        <p className="mt-2 text-sm text-muted-foreground">No conversations yet.</p>
        <Link to="/recruiter/discover" className="mt-4 inline-flex">
          <Button variant="hero">Find students to message</Button>
        </Link>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="container py-8 md:py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-normal md:text-4xl">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {!isPremium ? `${inMailUsed}/5 InMails used` : `${inMailUsed} sent · Priority`}
          </p>
        </div>
        {isPremium && (
          <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-semibold text-coral">Priority</span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card md:grid md:grid-cols-[280px_1fr]">
        <aside
          className={cn(
            "border-r border-border",
            mobileThread ? "hidden md:block" : "block",
          )}
        >
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">Conversations</div>
          <div className="max-h-[70vh] overflow-y-auto p-2">
            {conversationIds.map((id) => {
              const student = students.find((s) => s.id === id);
              if (!student) return null;
              const latest = (messages[id] ?? []).slice(-1)[0];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveId(id);
                    setMobileThread(true);
                  }}
                  className={cn(
                    "mb-1 w-full rounded-xl border px-3 py-2 text-left transition-colors",
                    activeId === id
                      ? "border-coral/40 bg-secondary/20"
                      : "border-transparent hover:border-border hover:bg-muted/30",
                  )}
                >
                  <p className="truncate text-sm font-semibold">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {latest?.text ?? seedReplies[id]?.[0] ?? "Start a conversation"}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={cn("flex min-h-[70vh] flex-col", mobileThread ? "block" : "hidden md:flex")}>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Button type="button" variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileThread(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="font-semibold">{activeStudent?.name ?? "Conversation"}</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {thread.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.from === "recruiter" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    msg.from === "recruiter"
                      ? "bg-foreground text-background"
                      : "border border-border bg-surface text-foreground",
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="h-10"
              />
              <Button type="submit" variant="hero" className="rounded-full px-3">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
};

export default RecruiterMessages;

