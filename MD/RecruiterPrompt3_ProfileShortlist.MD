# Cursor Prompt 3 — Student Profile + Shortlist

Third prompt. Builds the student profile (where the journey log finally renders) and
the Shortlist tab (with the free-tier counted cap). Assumes Prompts 1–2 are done:
context, `students`, `<PremiumGate>`, `<StudentCard>`, Dashboard + Discover all exist.

## Style / consistency
Match existing LEAP: Tailwind tokens (`text-coral`, `bg-secondary`, `bg-card`,
`leap-card`, `leap-panel`, `text-muted-foreground`, `font-display`), `Jumpy`,
framer-motion, `AnimatedPage`, existing buttons, same `whileInView` reveal. Responsive,
no horizontal overflow at 375px.

---

## 1. Student Profile — `/recruiter/student/:id`

This is NOT a nav tab. It opens when a recruiter clicks any `<StudentCard>` anywhere.
Read the `:id` param, find the student in the `students` array, render their full page.
Handle a missing id with a simple "Student not found" state.

This page is where "one video beats a ten-page CV" pays off — give the video real
estate high up. Layout top to bottom:

### a) Header (FREE — always visible)
- Large photo, name, degree + major(s), year, university, location, and the `oneLiner`.
- Two action buttons: **Shortlist** (bookmark toggle, same context helpers as the card)
  and **Message** (routes to `/recruiter/messages` with this student preselected, or
  opens a message composer — keep simple).

### b) Video hero (FREE — always visible)
- Prominent TikTok-style portrait (~9:16) video player using `student.video`
  (thumbnail + url + caption). This should sit near the top, right after/beside the
  header. It's the centrepiece.

### c) Journey Log timeline (PREMIUM — wrap in `<PremiumGate mode="blur">`)
- Render `student.journey` as a vertical timeline. Each entry: type badge
  (Event/Competition/Project/etc.), title, date, photo, the reflection text, and its
  skills as pill badges.
- Free users see it blurred with an "Upgrade to see full journey & evidence" overlay
  (this is the pricing image's "Full student profiles & evidence" line).

### d) Skills evidence (PREMIUM — gated)
- Roll up all skills across `student.journey` + `student.skills` into a deduped set,
  shown as badges, ideally noting which journey entries demonstrate each skill
  (e.g. small count or tooltip). Gate the same way.

### e) Projects / startup flag (PREMIUM — gated)
- If `hasStartup` or `hasProjects`, show a small highlighted callout ("Building a
  startup" / "Ships personal projects"). Gate with the rest of the evidence section.

Keep the header + video always visible so free users get a teaser and a reason to
"upgrade." Only the deeper evidence is gated.

---

## 2. Shortlist — `/recruiter/shortlist`

The saved-students tab. Reads `shortlist` (array of ids) from `useRecruiter()` and
renders those students.

- Render each shortlisted student with `<StudentCard variant="grid" />` in a responsive
  grid (reuse the card — no new card design).
- Each card's bookmark toggle removes them from the shortlist here too (already wired via
  context).
- **Empty state:** friendly message + a button linking to `/recruiter/discover`
  ("Find students to shortlist"). Jumpy can appear here for personality.

### Counted free-tier cap (this is the one piece of custom gating logic)
- FREE plan: cap the shortlist at **5 students**.
  - When a free user tries to add a 6th (from anywhere — card or profile), block it and
    show a toast/inline prompt: "Free plan is limited to 5 shortlisted students. Upgrade
    for unlimited." Do NOT add the 6th.
  - On the Shortlist page, when free and at the cap, show a small "5/5 · Upgrade for
    unlimited" indicator.
- PREMIUM plan: unlimited, no cap, no prompt.
- Implement this cap in the `toggleShortlist` logic (or a wrapper) so it's enforced
  everywhere the toggle exists, not just on this page. Reads `isPremium` from context.

---

## Deliverables checklist
- [ ] `/recruiter/student/:id` profile: free header + video hero, gated journey timeline, gated skills evidence, gated projects/startup flag
- [ ] Missing-id fallback handled
- [ ] Message button routes to messages (student preselected) — composer can be minimal
- [ ] Shortlist page renders shortlisted students via `<StudentCard>`, with empty state
- [ ] Free-tier 5-student cap enforced globally in the toggle logic, premium unlimited
- [ ] `<PremiumGate>` used for journey/evidence sections; counted cap uses `isPremium`
- [ ] Consistent styling + animations, responsive at 375px, no console errors

Do NOT build Messages or Analytics content here (Messages composer can be a minimal
stub for the routing) — those come in the next prompt.