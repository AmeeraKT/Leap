# Cursor Prompt: Rebuild Home.tsx landing sections

Refactor the "How Leap works" and "Features" sections in `src/Home.tsx`.
Keep all existing imports, the `Jumpy` component, framer-motion, `AnimatedPage`,
theming tokens (`text-coral`, `leap-band-deep`, `bg-background`, etc.) and the
Hero + Nav + CTA + Footer exactly as they are. Only rebuild the two middle sections
and update their copy. Do NOT touch the hero at the top.

## 1. Assets
Look inside `src/assets` and find the Jumpy image files (PNG/SVG/WebP). Import one
distinct Jumpy image per hero-journey phase (Explore, Engage, Capture, Showcase).
If there are exactly four Jumpy poses, map one to each phase. If there are fewer,
reuse sensibly but vary the pose/rotation so each section feels different. Use the
static image files here, NOT the animated `<Jumpy>` component, for the journey
sections.

## 2. "How LEAP works" — full-width alternating sections (replaces the 4-card grid)

Kill the card grid. Rebuild as FOUR stacked full-width sections, one phase each.
Layout per section: a 2-column grid on desktop (`md:grid-cols-2`), text on one
side, Jumpy image in the open white space on the opposite side. ALTERNATE sides:
- Section 1 (Explore): text LEFT, Jumpy RIGHT
- Section 2 (Engage): text RIGHT, Jumpy LEFT
- Section 3 (Capture): text LEFT, Jumpy RIGHT
- Section 4 (Showcase): text RIGHT, Jumpy LEFT
Use Tailwind `order-*` utilities to flip column order on `md+` for the alternating
sections. Give each section generous vertical padding (`py-24 md:py-32`) and lots of
breathing room, Duolingo-style open space, NOT cramped cards.

Text block per section:
- Small step number in muted/secondary colour (e.g. "01") above the title
- Big bold CAPITALISED title using `font-display` (like `text-5xl md:text-6xl font-normal`)
- One short flavour line below in `text-muted-foreground`, `text-lg`

Jumpy image: large, centred in its column, with a soft blurred glow blob behind it
(reuse the hero's `bg-secondary/30 blur-3xl` treatment).

Section intro (keep above the four sections, centred):
- Heading: "How LEAP works"
- Subtext: "Four hops from sign-up to career momentum."

### Updated copy (use exactly):
01 — EXPLORE
"Not sure what career fits? Jumpy matches you with events, communities and paths that actually suit you."

02 — ENGAGE
"Show up and stand out. Join events, meet like-minded students, and get brand coaching that gets you noticed."

03 — CAPTURE
"Never blank in an interview again. Log every event, project and connection as career-ready proof."

04 — SHOWCASE
"Turn your logs into LinkedIn posts and a portfolio that employers actually see."

## 3. Features — two sections, two features each (replaces the 4-card horizontal row)

Split the four features into TWO full-width bands, two features per band, arranged
with open space instead of tight boxes. Drop the heavy card look. Each feature =
icon + title (`font-display`) + short line, laid out cleanly with whitespace. Keep
each feature linking to its `to` route. Keep the section heading "Recipe to your success".

### Updated copy (use exactly):
Quiz & pathway plans — /quiz
"Take a quick quiz, get your top 3 career matches, and compare plans built around your goals."

Quest roadmap — /roadmap
"A six-stage career map with milestones, checklists, coaching and job predictions."

Journey log — /journey
"Log your wins, draft social posts, keep your streak, and earn XP as your brand grows."

Career Vision — /career-vision
"AI job matches, resume feedback, and Jumpy on call when you're stuck."

## 4. Scroll animations (the "expensive website" feel)

Use framer-motion `whileInView`. For every journey section and feature block:
- initial: `{ opacity: 0, y: 60 }`
- whileInView: `{ opacity: 1, y: 0 }`
- viewport: `{ once: true, margin: "-120px" }`
- transition: `{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }`  // easeOutExpo, luxurious

Stagger the text and image within a section slightly (image ~0.15s after text) using
`delay`. Elements should rise up from below and fade in on that same bezier curve.
Keep it smooth and slow, not bouncy. Define one reusable variants object and apply it
across sections so timing is consistent.

## 5. Mobile responsive (required)

- On `<md`, collapse every 2-column section to a single column (`grid-cols-1`).
- On mobile, stack Jumpy image ABOVE the text for ALL journey sections (ignore the
  alternating order on mobile so it reads top-to-bottom cleanly).
- Reduce Jumpy image size on mobile, scale titles down (`text-4xl` on mobile).
- Reduce vertical padding on mobile (`py-16`).
- Features: 1 column on mobile, 2 columns on `md+`.
- Ensure nothing overflows horizontally at 375px width.

Keep code clean and typed. Reuse existing Tailwind tokens and the existing
`containerVariants` / `itemVariants` where sensible, or add new ones if clearer.