# Cursor Prompt: Add Rewards page + fix Roadmap stage cards

Two tasks. Keep styling consistent with the rest of the app: reuse existing
Tailwind tokens (`text-coral`, `bg-secondary`, `leap-band-deep`, `leap-card`,
`leap-panel`, `bg-card`, `text-muted-foreground`, `font-display`), the `Jumpy`
component, framer-motion, `AnimatedPage`, and the same button/card patterns used
on Home and the dashboard. Match spacing, fonts, radii and animation feel already
in use.

## TASK 1 — New "Rewards" page (points + redemptions)

### Routing & nav
- Create `src/pages/Rewards.tsx` and add a route `/rewards`.
- In the navbar, make the user's LEVEL / XP indicator clickable — clicking it
  navigates to `/rewards`. (Find where level/XP is rendered in the nav/header and
  wrap it in a `Link to="/rewards"` with a hover state so it reads as clickable.)

### Top section — Points & progress
- Big display of total points earned (e.g. "1,240 pts").
- Current level and a progress bar showing XP toward the next level, with the exact
  amount remaining (e.g. "260 XP to Level 6"). Reuse the app's progress bar style if
  one exists; otherwise a rounded `bg-secondary` track with a `bg-coral` fill.
- Optional Jumpy (size "lg", animate "hop") in the open space beside the stats for
  personality, consistent with other pages.

### Redemption section — two categories
Below the stats, a "Redeem your points" area split into TWO clearly separated
sub-sections, each a responsive grid of reward cards (1 col mobile, 2–3 cols `md+`):

**A. Food & Beverage vouchers**
Cards for local Brisbane spots. Seed with these (name + discount + point cost):
- Yochi Frozen Yoghurt — $5 off (200 pts)
- Share Tea — $5 off (200 pts)
- Sushi Hub — $5 off (250 pts)
- Gelato — $5 off (250 pts)
- Add 1–2 generic café placeholders so the grid looks full.

**B. Event discounts**
Cards for competition / networking event savings:
- $5 off next networking event (300 pts)
- $10 off next competition entry (500 pts)
- Add 1–2 more event placeholders.

Each reward card shows: an icon (use lucide — e.g. `Coffee`/`UtensilsCrossed` for
F&B, `Ticket`/`Trophy` for events), title, discount, point cost, and a "Redeem"
button. Disable/grey the button when the user's points are below the cost. Make the
data an array of objects so cards render via `.map()` and are easy to edit later.
No backend needed — keep it a static/mock data array with a local `useState` for
points so a redemption visually deducts points (optimistic, front-end only).

Wrap page content in `AnimatedPage` and use the same `whileInView` fade-and-rise
animation used elsewhere for the section reveals.

## TASK 2 — Fix Roadmap stage cards (readability + colour states)

On the Roadmap/Quest page, the stage cards are too compact — the checklist inside
needs scrolling and is hard to read. Fix layout and colour:

### Colour states
- **Unlocked / completed stages:** light orange hue background (a soft coral/orange
  tint — e.g. a `coral`-based low-opacity fill like `bg-coral/10` with a `border-coral/30`
  border, adjust to match theme).
- **Locked / upcoming stages:** light grey (e.g. `bg-muted` / `bg-muted/40` with a
  muted border and slightly reduced opacity or a small lock icon).
Make this driven by each stage's status field (e.g. `status: "unlocked" | "locked"`)
so colours are conditional, not hardcoded per card.

### Bigger cards, less scrolling
- Enlarge the stage cards so their full checklist is visible WITHOUT an inner scroll.
  Remove any `overflow-y-scroll` / fixed-height constraints on the card body that
  currently clip the checklist.
- Change the grid so each row shows only TWO cards on desktop (`md:grid-cols-2`,
  `grid-cols-1` on mobile). This gives each card enough width/height for its content.
- Increase padding inside cards (`p-6 md:p-8`) and spacing between checklist items so
  the list is easy to scan. Let cards grow to fit their content (`h-full` within the
  row, no forced max-height).
- Keep the milestone/checklist styling but ensure the whole card expands naturally.

### Mobile
- Single column, comfortable padding, no horizontal overflow at 375px.
- Checklists fully visible, no nested scroll.

Keep everything typed and clean. Reuse existing card/animation components where they
exist rather than inventing new visual styles.