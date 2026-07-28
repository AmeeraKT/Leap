# Cursor Prompt 5 — Recruiter landing page + Free/Premium demo buttons + polish

Final prompt. Builds the real recruiter landing page (replacing the Prompt 1 stub),
wires the Free/Premium demo buttons that set the `plan` flag, and does a polish pass.
Assumes Prompts 1–4 are done: full recruiter app (Dashboard, Discover, Profile,
Shortlist, Messages, Analytics), context with `plan`, `<PremiumGate>`, matching, etc.

## Style / consistency
Match existing LEAP and mirror the STUDENT landing page's structure/quality (same nav,
hero rhythm, sections, animations) so the two audiences feel like one product. Reuse
Tailwind tokens (`text-coral`, `bg-secondary`, `bg-card`, `leap-band-deep`,
`leap-panel`, `text-muted-foreground`, `font-display`), `Jumpy`, framer-motion,
`AnimatedPage`, existing buttons, same `whileInView` easeOutExpo reveal. Responsive,
no horizontal overflow at 375px.

---

## 1. Recruiter landing page — `/recruiters` (replace the stub)

Keep the landing navbar audience toggle (For Students / For Recruiters) from Prompt 1 at
the top, with **For Recruiters** highlighted (teal curved bg, white text) on this route.

Recruiter-focused landing content — this audience is the CUSTOMER, so speak to them:

### Hero
- Headline options (pick one, or let me swap later): "Find the students you're already
  looking for." / "Hire the person, not the resume." / "Real students, ready to be found."
- Subtext: short line on the value — e.g. "LEAP surfaces proactive tech students through
  real projects and short-form video, so you see who they are, not just what they claim.
  AI matching finds the ones that fit."
- Jumpy in the hero (consistent with student landing).
- **Two demo buttons (the important part):**
  - **"Try demo — Free"** → sets `plan: "free"` in `RecruiterContext` and navigates to
    `/recruiter/dashboard`.
  - **"Try demo — Premium"** → sets `plan: "premium"` and navigates to
    `/recruiter/dashboard`.
  - Implement by setting the plan in context before/at navigation (e.g. a small handler
    that calls a `setPlan()` from context then routes). These two buttons are the ONLY
    way plan gets set now — remove/replace any earlier `?plan=` query testing hook, or
    keep it as a dev fallback but make the buttons authoritative.

### Supporting sections (mirror student landing quality)
- **The problem (recruiter framed):** brief — AI CVs all look the same, fakes look real,
  hard to see drive/personality from a resume. Keep it tight, a few lines + maybe stat
  chips (2 in 5 recruiters say AI CVs make assessing harder; 25 days to fill; $17k/hire).
- **How it works (recruiter POV):** 3 beats — students document their journey TikTok-style
  → LEAP builds a pool of proactive tech students → describe who you want, AI matches them.
- **Free vs Premium comparison:** a two-column comparison (mirror the pricing image):
  - FREE — "Get started and explore talent": limited student search, view limited
    profiles, 5 InMails.
  - PREMIUM — "Go deeper. Hire with confidence": advanced search & filters, full profiles
    & evidence, AI-powered matching, unlimited + priority InMail, insights & analytics.
  - Put the two demo buttons here as well (Free under the free column, Premium under the
    premium column) so the CTA repeats naturally.
- **Final CTA band:** repeat the demo buttons once more.

---

## 2. Final polish pass (across the recruiter app)

- **Plan pill / upgrade:** ensure the nav "Free plan · Upgrade" pill reflects the actual
  `plan`. On free, an "Upgrade" affordance can route back to `/recruiters#pricing` or
  flip a demo upgrade — keep simple, but make it consistent.
- **Consistency sweep:** confirm `<StudentCard>` looks identical across Dashboard,
  Discover, Shortlist, and Jumpy results. Confirm all gated features (`AI hero`, advanced
  filters, journey/evidence, analytics, Jumpy chat) show a coherent, consistent Premium
  locked-state style. Confirm the two counted caps (shortlist 5, InMail 5) both work and
  both show a matching "x/5 · Upgrade" style.
- **Empty states:** every list view (Discover no-match, Shortlist empty, Messages empty,
  Jumpy no-results) has a friendly styled empty state.
- **Responsive sweep:** all recruiter pages clean at 375px — nav collapses sensibly,
  grids reflow to 1 col, two-pane Messages collapses, filters go to a drawer.
- **Animation sweep:** section reveals and card hovers consistent app-wide; nothing janky.
- **Route sanity:** For Students / For Recruiters toggle works both directions; login
  page role choice routes correctly; profile links resolve; back navigation works.
- **No console errors / no broken images** (placeholders where assets missing).

---

## Deliverables checklist
- [ ] `/recruiters` real landing page, "For Recruiters" toggle highlighted, mirrors student-landing quality
- [ ] Hero with recruiter messaging + Jumpy
- [ ] Free/Premium demo buttons set `plan` in context and route to `/recruiter/dashboard` (authoritative)
- [ ] Problem, How-it-works, Free-vs-Premium comparison, final CTA sections
- [ ] Demo buttons repeated in pricing + final CTA
- [ ] Polish sweep: plan pill, gating consistency, both counted caps, empty states, responsive, animations, routes, no errors

This completes the recruiter side.