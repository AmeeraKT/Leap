import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Jumpy } from "@/components/Jumpy";
import { students } from "@/data/students";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TalentFilter = "all" | "shortlist";

/** Students who reached out first. Shown on All even before the recruiter replies. */
const inboundContactIds = ["st-alex-chen", "st-samira-khan"];

const seedReplies: Record<string, string[]> = {
  "st-alex-chen": [
    "Hi — I wanted to reach out about the AI study tool I shipped this semester.",
    "Happy to share my latest project notes if helpful.",
  ],
  "st-samira-khan": [
    "Hello, I came across your search and wanted to connect.",
    "I'm especially interested in product + analytics roles.",
  ],
};

const RecruiterMyTalent = () => {
  const { messages, sendMessage, inMailUsed, isPremium, shortlist, isShortlisted, toggleShortlist } =
    useRecruiter();
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedId = searchParams.get("student") ?? "";
  const filter: TalentFilter = searchParams.get("filter") === "shortlist" ? "shortlist" : "all";
  const [activeId, setActiveId] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileThread, setMobileThread] = useState(Boolean(preselectedId));

  const outboundIds = useMemo(
    () =>
      Object.keys(messages).filter((id) =>
        (messages[id] ?? []).some((message) => message.from === "recruiter"),
      ),
    [messages],
  );

  const allIds = useMemo(() => {
    const ids = new Set<string>([...inboundContactIds, ...outboundIds]);
    if (preselectedId && filter === "all") ids.add(preselectedId);
    return [...ids];
  }, [filter, outboundIds, preselectedId]);

  const visibleIds = filter === "shortlist" ? shortlist : allIds;

  useEffect(() => {
    if (preselectedId && visibleIds.includes(preselectedId)) {
      setActiveId(preselectedId);
      return;
    }
    if (!activeId || !visibleIds.includes(activeId)) {
      setActiveId(visibleIds[0] ?? "");
    }
  }, [activeId, preselectedId, visibleIds]);

  const setFilter = (next: TalentFilter) => {
    const params = new URLSearchParams(searchParams);
    if (next === "shortlist") {
      params.set("filter", "shortlist");
    } else {
      params.delete("filter");
      const studentId = params.get("student");
      const isContact =
        !!studentId && (inboundContactIds.includes(studentId) || outboundIds.includes(studentId));
      if (studentId && !isContact) params.delete("student");
    }
    setSearchParams(params, { replace: true });
    setMobileThread(false);
  };

  const selectStudent = (id: string) => {
    setActiveId(id);
    setMobileThread(true);
    const params = new URLSearchParams(searchParams);
    params.set("student", id);
    setSearchParams(params, { replace: true });
  };

  const activeStudent = students.find((student) => student.id === activeId);
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

  const activeShortlisted = activeId ? isShortlisted(activeId) : false;

  return (
    <AnimatedPage className="container py-8 md:py-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-normal md:text-4xl">My Talent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages with students and the people you have shortlisted.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isPremium && (
            <span className="rounded-full border border-coral/30 bg-secondary/30 px-3 py-1 text-xs font-semibold text-coral">
              {shortlist.length}/5 shortlisted · {inMailUsed}/5 InMails
            </span>
          )}
          {isPremium && (
            <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-semibold text-coral">
              {inMailUsed} sent · Priority
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 flex gap-2" role="tablist" aria-label="Talent filters">
        {(
          [
            ["all", "All"],
            ["shortlist", "Shortlist"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === key
                ? "bg-secondary text-secondary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleIds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mb-3 inline-flex">
            <Jumpy size="sm" animate="float" />
          </div>
          {filter === "shortlist" ? (
            <>
              <h2 className="font-display text-2xl font-normal">No students shortlisted yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse discover and save standout students here.
              </p>
              <Link to="/recruiter/discover" className="mt-4 inline-flex">
                <Button variant="hero">Find students to shortlist</Button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-normal">No conversations yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Students you contact, and students who contact you, show up here.
              </p>
              <Link to="/recruiter/discover" className="mt-4 inline-flex">
                <Button variant="hero">Find students to message</Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card md:grid md:grid-cols-[280px_1fr]">
          <aside className={cn("border-r border-border", mobileThread ? "hidden md:block" : "block")}>
            <div className="border-b border-border px-4 py-3 text-sm font-semibold">
              {filter === "shortlist" ? "Shortlist" : "Conversations"}
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {visibleIds.map((id) => {
                const student = students.find((item) => item.id === id);
                if (!student) return null;
                const latest = (messages[id] ?? []).slice(-1)[0];
                const shortlisted = isShortlisted(id);
                return (
                  <div
                    key={id}
                    className={cn(
                      "mb-1 flex items-stretch rounded-xl border transition-colors",
                      activeId === id
                        ? "border-coral/40 bg-secondary/20"
                        : "border-transparent hover:border-border hover:bg-muted/30",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectStudent(id)}
                      className="min-w-0 flex-1 px-3 py-2 text-left"
                    >
                      <p className="truncate text-sm font-semibold">{student.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {latest?.text ?? seedReplies[id]?.[0] ?? "Start a conversation"}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(id)}
                      aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
                      className={cn(
                        "mr-1 mt-1 h-8 w-8 shrink-0 rounded-full",
                        shortlisted ? "text-coral" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {shortlisted ? <BookmarkCheck className="mx-auto h-4 w-4" /> : <Bookmark className="mx-auto h-4 w-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className={cn("min-h-[70vh] flex-col", mobileThread ? "flex" : "hidden md:flex")}>
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileThread(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <p className="min-w-0 flex-1 truncate font-semibold">{activeStudent?.name ?? "Conversation"}</p>
              {activeId && (
                <Button
                  type="button"
                  variant={activeShortlisted ? "coral" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => toggleShortlist(activeId)}
                >
                  {activeShortlisted ? (
                    <BookmarkCheck className="mr-1 h-4 w-4" />
                  ) : (
                    <Bookmark className="mr-1 h-4 w-4" />
                  )}
                  {activeShortlisted ? "Shortlisted" : "Shortlist"}
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {thread.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet. Send the first note.</p>
              ) : (
                thread.map((msg) => (
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
                ))
              )}
            </div>

            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 pr-14"
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
      )}
    </AnimatedPage>
  );
};

export default RecruiterMyTalent;
