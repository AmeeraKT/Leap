# Cursor Prompt: Add "Gamified rewards" section to bottom of Features page

Add a NEW section at the BOTTOM of the features area (after the last feature band,
before the CTA). It sells the gamified loop: earn points for your work, redeem them
for real rewards.

## Style
Match the rest of LEAP: reuse Tailwind tokens (`text-coral`, `bg-secondary`,
`bg-card`, `leap-band-deep`, `leap-panel`, `text-muted-foreground`, `font-display`),
the `Jumpy` component, framer-motion, and the same `whileInView` fade-and-rise
animation (`{ opacity:0, y:60 }` → `{ opacity:1, y:0 }`, easeOutExpo
`ease:[0.16,1,0.3,1]`, `viewport:{ once:true, margin:"-120px" }`). Give it a coral or
`leap-band-deep` accent so it pops as the "fun" section.

## Layout — two columns on desktop, stacked on mobile
LEFT (or top on mobile): copy + the 3-step loop.
RIGHT (or below on mobile): a placeholder for a GIF (I'll drop it in). Use an
`<img>` with `src="/assets/rewards-loop.gif"` (create the folder/path reference,
leave a labelled placeholder box if the file isn't there yet), rounded corners,
soft shadow, and the hero's blurred glow blob behind it (`bg-secondary/30 blur-3xl`).

### Copy (use exactly)
Eyebrow: "GAMIFIED"
Heading: "Your effort actually pays off"
Subtext: "Show up, log your wins, earn points — then cash them in for real rewards."

### The 3-step loop (render as three connected steps with arrows/chevrons between)
Use lucide icons + short labels, laid out horizontally on desktop, vertical on mobile,
with a small `ChevronRight` (or down-chevron on mobile) between each:
1. Icon `CheckCircle` — "Complete tasks & attend events"
2. Icon `Zap` (or `Sparkles`) — "Earn XP + points"
3. Icon `Gift` (or `Ticket`) — "Redeem rewards"

### Reward examples (small chips/badges under the loop)
Row of pill badges: "Event ticket discounts", "Yochi vouchers", "Café & F&B deals",
"and more". Style as rounded `bg-secondary` chips with icons where it fits.

### CTA
A small `Link to="/rewards"` button: "See rewards" — reuse existing button variant.

## Animation touch
Stagger the three loop steps in one after another (delay each ~0.12s) so the loop
"builds" as it scrolls into view. Keep it smooth, not bouncy.

## Mobile
Single column, loop goes vertical with down-chevrons, GIF below the copy, chips wrap,
no horizontal overflow at 375px.

# Cursor Prompt: Add slow text marquee of rewards to the Gamified section

In the "Gamified rewards" section at the bottom of the Features page, add a
horizontal auto-scrolling text carousel (marquee) of available rewards.

## Content — 6 items, in this order
- Event ticket discounts
- Yochi vouchers
- Café & F&B deals
- Competition entry discounts
- Networking event passes
- Exclusive workshops

## Look
- Big, bold text: `font-display font-bold text-3xl md:text-5xl`.
- Each item separated by a DOT ("•") with EQUAL spacing on both sides of every dot,
  so the rhythm is consistent (e.g. wrap each item and each dot so gaps are uniform —
  use a fixed horizontal margin/padding like `mx-8` on both items and dots, don't rely
  on inconsistent inline spaces).
- Colour: use `text-foreground` for items and `text-coral` for the dots so the dots
  pop. (Or reverse if it reads better on the section's background.)
- Full-bleed width, no visible scrollbar, `overflow-hidden` on the container.

## Motion
- Continuous horizontal scroll, moving SLOWLY and smoothly (right → left), infinite loop
  with NO visible jump — duplicate the list twice inside the track and translate the
  track by -50% so it seamlessly repeats.
- Implement with CSS keyframes (preferred for smoothness) OR framer-motion. If CSS:
```css
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .marquee-track { animation: marquee 30s linear infinite; }
```
  Use a slow duration (~30–40s) so it drifts, not races.
- Pause on hover (`:hover { animation-play-state: paused; }`) — nice touch.
- Add soft fade masks on the left and right edges so text fades in/out instead of
  hard-cutting (CSS `mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`).

## Structure
- Track is a single flex row (`flex whitespace-nowrap w-max`) containing the 6 items +
  dots, then the SAME set duplicated for the seamless loop.
- Keep it accessible: `aria-hidden` on the duplicated copy so screen readers don't read
  rewards twice.

## Mobile
- Slightly smaller text on mobile (`text-3xl`), same slow scroll, still full-bleed and
  seamless, no horizontal page overflow.