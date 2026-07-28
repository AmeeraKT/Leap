# Cursor Prompt 4 — Messages + Analytics (+ Jumpy AI matching chat)

Fourth prompt. Builds the last two nav tabs and wires the floating Jumpy chat for
AI-style matching. Assumes Prompts 1–3 are done: context, `students`, `<PremiumGate>`,
`<StudentCard>`, Dashboard, Discover, Profile, Shortlist all exist.

## Style / consistency
Match existing LEAP: Tailwind tokens (`text-coral`, `bg-secondary`, `bg-card`,
`leap-card`, `leap-panel`, `text-muted-foreground`, `font-display`), `Jumpy`,
framer-motion, `AnimatedPage`, existing buttons, same `whileInView` reveal. Responsive,
no horizontal overflow at 375px.

---

## 1. Messages — `/recruiter/messages`

A simple InMail-style messaging view. Reads/writes the `messages` object from
`useRecruiter()` (keyed by student id).

### Layout
- Two-pane on desktop: left = conversation list (students the recruiter has messaged),
  right = the open conversation thread. On mobile, show the list, tapping a conversation
  opens the thread full-screen with a back button.
- If arriving from a profile's "Message" button with a preselected student, open (or
  start) that conversation automatically.

### Conversation thread
- Show message bubbles (recruiter's messages aligned one side, student's mock replies
  the other). Seed each conversation with 1–2 mock student replies so it looks alive.
- A composer at the bottom: text input + Send. Send appends to the `messages` state for
  that student. (No real backend — optionally fake a canned student reply after a short
  delay for demo flavour.)

### Counted free-tier cap (InMail limit)
- FREE plan: limit to **5 sent InMails total** (across all conversations).
  - When a free user tries to send a 6th, block it and show: "Free plan includes 5
    InMails. Upgrade for unlimited + priority messaging." Don't send the 6th.
  - Show a small "3/5 InMails used" style counter somewhere visible.
- PREMIUM plan: unlimited, plus a small **"Priority"** badge on the composer/threads
  (from the pricing image's "InMail & priority messaging" line).
- Enforce the cap in the send logic, reading `isPremium`.

### Empty state
- No conversations yet → friendly prompt linking to Discover to find students to message.

---

## 2. Analytics — `/recruiter/analytics` (entirely PREMIUM)

Whole page is gated. Structure:
`isPremium ? <AnalyticsContent/> : <PremiumUpsell/>`
- `<PremiumUpsell/>`: a clean locked state — heading, short value line ("Unlock hiring
  insights & talent analytics"), a blurred/preview backdrop of the charts, and an
  Upgrade button. (Can reuse `<PremiumGate mode="blur">` wrapping the content if easier.)

### AnalyticsContent (mock/hardcoded data is fine — derive from `students` where possible)
Show a few hiring-insight widgets. Use a chart lib already in the project (recharts if
available) or simple styled bars:
- **Most-contacted universities** — bar chart (derive from `students` `university` +
  `contactedCount`, or mock).
- **Recruiter interest by major** — bar/pie of interest across majors (mock or derived
  from `contactedCount` grouped by major).
- **Talent composition** — small stat cards: "% building a startup"
  (`hasStartup` share), "% with personal projects" (`hasProjects` share), total students
  in pool, average year.
- **Trending skills** — top skills across the pool by frequency (derive from
  `students[].skills`).
Keep it visual and scannable — this sells the premium tier in the demo. Derive real
numbers from the `students` array where you can so it feels legit; mock the rest.

---

## 3. Jumpy floating chat — AI-style matching (PREMIUM)

Upgrade the floating Jumpy button (bottom-right, from Prompt 1) into a working matching
chat panel.
- Clicking opens a chat panel/drawer.
- Wrap the input/matching in `<PremiumGate>` — same gate as the Dashboard AI hero (they
  share the "engine"). Free users see it with a Premium badge + teaser.
- Premium: recruiter types who they're looking for (e.g. "a second-year AI student who's
  shipped a project"). Do a NAIVE local match — score `students` by keyword overlap
  against `majors`, `skills`, `year`, `oneLiner`, `hasStartup`/`hasProjects` — and return
  the top few as `<StudentCard>`s (or compact rows) inside the chat, each linking to the
  profile. No real LLM; keep it deterministic and local.
- Give Jumpy a short friendly intro line and keep the panel styled like the rest of LEAP.
- If the Dashboard AI hero (Prompt 2) already does this matching, reuse the same matching
  function here so there's one source of truth.

---

## Deliverables checklist
- [ ] Messages: two-pane (mobile-friendly), seeded mock conversations, working composer
- [ ] InMail free cap (5) enforced in send logic; premium unlimited + Priority badge
- [ ] Preselected student opens correct conversation from profile "Message" button
- [ ] Analytics fully gated; premium content with 3–4 insight widgets (real where derivable, mock otherwise)
- [ ] Jumpy floating chat does local keyword matching, gated as premium, returns linked student cards
- [ ] One shared matching function reused by Dashboard hero + Jumpy chat
- [ ] Consistent styling + animations, responsive at 375px, no console errors

After this, only the recruiter landing page + Free/Premium demo buttons + final polish
remain (next prompt).