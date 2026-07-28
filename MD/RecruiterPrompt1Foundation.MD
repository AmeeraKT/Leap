# Cursor Prompt 1 — Recruiter side foundation

This is the FIRST of several prompts. Goal: set up the skeleton, data, routing and
gating primitive for a recruiter-side experience, WITHOUT building the individual
recruiter pages yet (those come in later prompts). No real authentication anywhere —
everything is demo-only, accessed via demo buttons.

## Style / consistency (applies to everything)
Match the existing LEAP app. Reuse Tailwind tokens (`text-coral`, `bg-secondary`,
`bg-card`, `leap-card`, `leap-panel`, `leap-band-deep`, `text-muted-foreground`,
`font-display`), the `Jumpy` component, framer-motion, `AnimatedPage`, and existing
button variants. The recruiter side should feel like the same product, just a
different audience.

---

## 1. Landing page audience toggle (For Students / For Recruiters)

On the existing landing page navbar, add a two-option toggle: **For Students** and
**For Recruiters**.
- Default route (`/`) shows the CURRENT student landing page unchanged.
- Create a NEW separate recruiter landing page at `/recruiters`. For now it can be a
  simple placeholder hero (heading + subtext) — the real recruiter landing content and
  demo buttons come in a LATER prompt. Just make the route and a stub page exist.
- Toggle styling: the ACTIVE option has a teal curved background (`bg-secondary` or the
  teal token, `rounded-full`) with white text. The inactive option is plain
  text (`text-muted-foreground`, hover to `text-foreground`).
  - On `/` → "For Students" is active (highlighted).
  - On `/recruiters` → "For Recruiters" is active (highlighted).
- Clicking each toggles navigation between the two landing pages. Put the toggle in the
  same navbar location on both pages so it feels persistent.

Do NOT touch the rest of the student landing page content.

---

## 2. "Login" page role choice (cosmetic only — no auth)

The existing login page does NOT actually authenticate and that's fine — leave it that
way. Just ADD a role choice to it: two options / cards, "I'm a Student" and
"I'm a Recruiter."
- "I'm a Student" → routes to the existing student demo entry (wherever the current
  student demo account currently lands).
- "I'm a Recruiter" → routes to `/recruiters` (the recruiter landing page).
- This is purely navigational sugar. No login logic, no validation, no state. Keep it
  styled consistently with the existing login page.

---

## 3. Recruiter app shell + routing

Create a recruiter route tree under `/recruiter/*` with its OWN layout shell, separate
from the student app's nav.
- Layout: a recruiter nav (sidebar or top nav — match whatever the student app uses so
  they're visually consistent) with these tab links (pages are stubs for now, built in
  later prompts):
  - Dashboard → `/recruiter/dashboard`
  - Discover → `/recruiter/discover`
  - Shortlist → `/recruiter/shortlist`
  - Messages → `/recruiter/messages`
  - Analytics → `/recruiter/analytics`
- Each of the five pages should be a minimal stub component for now (just the page
  title in the shell) so routing works end to end. We'll fill them in later.
- Add a floating **Jumpy** button bottom-right in the recruiter shell (visible on all
  recruiter pages). For now clicking it can just open an empty chat panel stub — wiring
  the AI matching comes later.
- Optional: a small "Free plan · Upgrade" pill in the nav that reads the `plan` flag
  (see below). Keep it subtle.

---

## 4. Recruiter context (global state)

Create a `RecruiterContext` (React context + provider) wrapping the `/recruiter/*` tree.
State it holds:
- `plan: "free" | "premium"` — defaults to `"free"`. Set by whichever demo button the
  user clicked (demo buttons come in a later prompt; for now default to `"free"` and
  allow it to be set via the route/query so we can test, e.g. `/recruiter/dashboard?plan=premium`).
- `isPremium` — derived helper (`plan === "premium"`).
- `shortlist: string[]` — array of student ids. Add `toggleShortlist(id)` and
  `isShortlisted(id)` helpers.
- `messages` — an object keyed by student id (each value an array of message objects).
  Add a helper to send/append a message. Keep simple.
Expose all via a `useRecruiter()` hook. Use `useState` — no backend, no persistence
needed for the MVP.

---

## 5. Student data array (the whole "backend")

Create `src/data/students.ts` exporting a typed `students` array. This single array
powers every recruiter view. Use this exact shape and seed it with **8–10 realistic
demo students** (varied degrees, majors, years, a mix of `hasStartup`/`hasProjects`,
some `featured: true`):

```ts
export type JourneyEntry = {
  type: "Event" | "Competition" | "Project" | "Internship" | "Volunteer";
  title: string;
  date: string;          // ISO
  photo: string;
  reflection: string;
  skills: string[];
};

export type Student = {
  id: string;
  name: string;
  photo: string;
  oneLiner: string;

  // Discover filters
  degree: "IT" | "Computer Science" | "Double Degree";
  majors: string[];       // e.g. ["Artificial Intelligence", "UX Design"]
  year: 1 | 2 | 3 | 4;
  university: string;
  skills: string[];

  // Dashboard spotlight / profile hero
  featured: boolean;
  video: { thumbnail: string; url: string; caption: string };

  // Journey log (renders on profile)
  journey: JourneyEntry[];

  // Analytics flags
  hasStartup: boolean;
  hasProjects: boolean;
  contactedCount: number;

  // Premium gating
  isPremiumProfile: boolean;
};

export const students: Student[] = [ /* 8–10 seeded students */ ];
```

For image fields, use placeholder paths or a placeholder image service so nothing
breaks if assets are missing. Make the `oneLiner`s punchy and specific (e.g.
"Built an AI study tool that hit 2k users in a semester").

---

## 6. `<PremiumGate>` component (the reusable gating primitive)

Create `src/components/recruiter/PremiumGate.tsx`. Props:
- `children` — the premium content.
- `fallback?` — optional custom locked-state UI.
- `mode?: "badge" | "blur" | "lock"` — default `"lock"`.
Behaviour: reads `isPremium` from `useRecruiter()`. If premium, render children. If
free, render the fallback (or a default locked state: a small "Premium" badge using
`text-coral`/`bg-secondary`, a lock icon from lucide, and a short "Upgrade to unlock"
line). For `"blur"` mode, render children blurred/non-interactive with an overlay.
Keep it clean and reusable — later prompts will wrap features in this.

---

## Deliverables checklist
- [ ] Landing navbar toggle (For Students / For Recruiters), teal curved highlight on active
- [ ] `/recruiters` recruiter landing STUB page exists
- [ ] Login page has cosmetic Student / Recruiter role choice (no auth) that routes correctly
- [ ] `/recruiter/*` shell with nav + 5 stub pages + floating Jumpy stub
- [ ] `RecruiterContext` with `plan`/`isPremium`/`shortlist`/`messages` + `useRecruiter()`
- [ ] `src/data/students.ts` typed array seeded with 8–10 students
- [ ] `<PremiumGate>` component built and reusable
- [ ] Everything styled consistent with existing LEAP app, responsive, no console errors

Do NOT build the full Dashboard, Discover, Profile, Shortlist, Messages, Analytics
content yet — those come in the next prompts. Keep pages as stubs.