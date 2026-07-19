# Cursor Prompt: Rebuild the LEAP quiz for local university students

## Context
The existing quiz was written for **high-school students wanting to study abroad**.
LEAP has pivoted: it now serves **current university students in Australia** who want
career direction, a personal brand, and community. Rewrite the quiz so every question
reflects a uni student's reality (their degree, campus life, local job market, career
goals), NOT overseas study decisions.

## Global requirements (apply to the whole quiz)
- **Entry point:** The "Get started" button in the hero (`/quiz`) opens the FIRST
  quiz step. Confirm the route wiring so hero → quiz step 1 works.
- **Style consistency:** Match the rest of the app. Reuse existing Tailwind tokens
  (`text-coral`, `bg-secondary`, `bg-card`, `leap-card`, `leap-panel`, `leap-band-deep`,
  `text-muted-foreground`, `font-display`), the `Jumpy` component, framer-motion, and
  `AnimatedPage`. Buttons, radii, spacing and fonts should look native to LEAP.
- **Progress:** Keep a progress bar / "Section X of Y" indicator at the top, styled
  with `bg-secondary` track + `bg-coral` fill. Update the total to match the new
  number of steps.
- **Multi-step flow:** One section per screen with Back / Next navigation. Persist
  answers in state across steps (a single `quizState` object or context) so nothing
  is lost when navigating.
- **Input rule — dropdowns for long lists:** If a question has **more than 5 options**,
  render it as a **dropdown / select** (reuse the app's existing `Select` component if
  one exists in `@/components/ui`). If **5 or fewer**, render as tappable pill/card
  buttons (single or multi-select as noted). "Select all that apply" questions can stay
  as multi-select chips even when long, but collapse into a searchable multi-select
  dropdown if the list exceeds ~8 to avoid a wall of chips.
- **Sliders:** Personality section uses labelled range sliders (left label ↔ right label).
- **Drag & drop:** Priority ranking uses draggable reorderable items (reuse an existing
  dnd util if present, otherwise a lightweight library like `@dnd-kit/core`).
- **Animation:** Each step fades/rises in (`whileInView` or on-mount) with the app's
  existing easing for a smooth, premium feel.
- **Mobile:** Fully responsive, single column, no horizontal overflow at 375px, sliders
  and drag-drop usable by touch.

---

## Updated quiz content (use exactly)

> Note: options rewritten for AUSTRALIAN university students. Removed "study abroad"
> framing. Anything with >5 options is marked **[dropdown]**.

### Section 1 · Profile — "Let's start with you"
Subtext: "We'll start with what you're studying, what you're into, and what you want out of it."

**What are you studying (or drawn to)?** — multi-select, **[dropdown, multi]**
Select all that apply. We use this to shape your pathway matches.
- Engineering
- Technology / IT
- Science / Research
- Business
- Creative Industries
- Health / Medicine
- Law
- Education
- Environmental Science
- Social Sciences
- Unsure / still exploring

**Interests outside study** — multi-select, **[dropdown, multi]**
Optional, but it helps us recommend communities and events you'll actually like.
- Painting
- Reading
- Writing
- Building / making things
- Cooking
- Gardening
- Tennis
- Badminton
- Hiking
- Kayaking
- Gaming
- Music

---

### Section 2 · Academics — "Where are you at academically?"
Subtext: "Tell us about your current studies."

**Current education level** — 5 options, pill buttons (single select)
- TAFE / VET
- Undergraduate
- Postgraduate
- Recent graduate
- Not studying right now

**What year are you in?** — pill buttons (single select)
- 1st year
- 2nd year
- 3rd year
- 4th year+
- Not applicable

**Field of study** — free text input (or reuse the study dropdown from Section 1)

---

### Section 3a · Career · Current — "Where are you now in your career?"
Subtext: "Your current situation helps us understand your starting point."

**Current employment status** — 5 options, pill buttons (single select)
- Studying, not working
- Part-time / casual work
- Full-time employed
- Internship / placement
- Self-employed / freelancing

**Current or most recent industry** — **[dropdown]** (7 options)
- Technology
- Healthcare
- Retail / Hospitality
- Construction / Trades
- Education
- No work experience yet
- Other

**Years of work experience** — 4 options, pill buttons (single select)
- None
- 1–2 years
- 3–5 years
- 5+ years

**Top skills** — multi-select, **[dropdown, multi]** (7 options)
Select all that apply.
- Digital / Tech
- Creative
- Communication
- Analytical
- Leadership
- Trades / Hands-on
- Care / Empathy

---

### Section 3b · Career · Aspirations — "Where do you want to go?"
Subtext: "Tell us about the career and work style you're aiming for."

**Desired career field** — **[dropdown]** (8 options, single select — pick your top match)
- Technology
- Healthcare
- Creative Industries
- Business
- Environment / Sustainability
- Trades
- Education
- Community / Social Impact

**Salary expectations (first 5 years)** — 4 options, pill buttons (single select)
- Entry level · $50–65k
- Mid range · $65–90k
- High · $90–120k
- Premium · $120k+

**When do you want to start your career?** — 4 options, pill buttons (single select)
- ASAP — within 6 months
- Within a year
- After I graduate
- Flexible / not sure yet

**Work flexibility preference** — 5 options, pill buttons (single select)
- Remote / WFH
- Hybrid
- In-office
- Fieldwork / on-site
- Open to anything

---

### Section 4 · Learning Style & Personality — "How do you work and learn?"
Subtext: "Slide to wherever feels most like you. These shape how we match you to
environments and communities."

Render each as a labelled slider (left ↔ right):
1. Learn best with others ↔ Prefer solo, independent work
2. Need clear structure and deadlines ↔ Prefer flexible, self-paced
3. Drawn to creative, open-ended work ↔ Drawn to logical, data-driven problems
4. Want rapid career progression ↔ Prefer a steady, lower-pressure path
5. Open to risk and new challenges ↔ Value stability and a clear ladder
6. Thrive in fast-paced, high-pressure settings ↔ Prefer a slower, measured pace
7. Focus on big-picture vision ↔ Focus on detail, accuracy and process
8. Want quick wins and early rewards ↔ Happy to invest time for bigger long-term payoff

---

### Section 5 · Student Life — "What matters most in your student life?"
Subtext: "Your ideal environment and what you value."

**Where are you based / want to be?** — 4 options, pill buttons (single select)
- Major city (Brisbane, Sydney, Melbourne)
- Regional / smaller city
- Rural / country
- Open to anything

**Campus / social environment** — 3 options, pill buttons (single select)
- Vibrant, social campus
- Quiet, study-focused
- A balanced mix

**Commute tolerance** — 3 options, pill buttons (single select)
- Minimal — 15 min max
- Moderate — up to 45 min
- Flexible — happy to travel

**Work–life balance priority** — 3 options, pill buttons (single select)
- Career-focused
- Balanced
- Life / health first

**Rank your overall priorities** — drag & drop reorderable list
Instruction: "Drag to rank what matters most to you."
- Getting into the workforce fast and earning
- Following my passion
- Lifestyle fit
- Social impact
- High salary

---

## Completion
On finishing the last step, submit `quizState` and route the user to their results /
pathway matches page (top 3 matches), consistent with the existing post-quiz flow.
Keep the results screen styling aligned with the rest of LEAP. If a results page
doesn't exist yet, stub it with a "Your top 3 pathway matches" placeholder that reads
from `quizState` so the flow is complete.

## Deliverables checklist
- [ ] Hero "Get started" → quiz step 1 wired
- [ ] All 6 sections rebuilt with the copy above (uni-student framing, no study-abroad)
- [ ] >5 options → dropdown; ≤5 → pill buttons
- [ ] Personality sliders + drag-drop ranking working (touch-friendly)
- [ ] Progress indicator total updated
- [ ] State persists across steps
- [ ] Fully responsive at 375px, styling consistent with LEAP
- [ ] Routes to results on completion