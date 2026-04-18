# Prompt: Recreate the AP Physics 1 Study App

Paste the prompt below into a fresh Claude Code session to rebuild this exact
app from scratch. It describes only what the app does and what it contains —
not how to architect it. Pick your own stack, file layout, and implementation
choices.

---

## The Prompt

Build a complete, polished web study app for **AP Physics 1: Algebra-Based**,
aligned with the College Board 2025–26 CED. The app should feel like a premium,
interactive study companion — beautiful, animated, fast, and content-rich.

### Scope: 8 official AP Physics 1 units

Each unit must include real physics content (not placeholders):

1. **Kinematics** (10–15%) — Position & Velocity, Acceleration, Kinematic Equations, Projectile Motion, Motion Graphs
2. **Force and Translational Dynamics** (18–23%) — Newton's Laws, Friction, Tension & Normal Force, Inclined Planes, Atwood Machines
3. **Work, Energy, and Power** (18–23%) — Work, Kinetic Energy, Potential Energy, Conservation of Energy, Power
4. **Linear Momentum** (10–15%) — Momentum & Impulse, Impulse-Force, Conservation of Momentum, Elastic Collisions, Inelastic Collisions
5. **Torque and Rotational Dynamics** (10–15%) — Torque Basics, Angular Kinematics, Moment of Inertia, Newton's Second Law for Rotation, Rotational Equilibrium
6. **Energy and Momentum of Rotating Systems** (5–8%) — Rotational KE, Angular Momentum, Conservation of Angular Momentum, Rolling Motion, Combined Rotation
7. **Oscillations** (5–8%) — SHM Basics, Spring-Mass System, Pendulum, Energy in SHM, SHM Graphs
8. **Fluids** (10–15%) — Pressure & Depth, Pascal's Law, Buoyancy, Continuity, Bernoulli's Equation

### Per-unit features (every unit gets all of these)

**Learn section**
- 5 interactive topic pages — each with explanations, KaTeX-rendered equations,
  inline SVG simulations, and live-adjustable sliders/parameters that update
  the visualization in real time
- **Concept Map** — visual graph showing how the unit's ideas connect
- **Real-World Examples** — concrete situations the physics applies to
- **What If? Scenarios** — counterfactual prompts that build intuition

**Practice section**
- **Topic Quiz** — 20 multiple-choice questions per unit, instant feedback,
  explanations
- **Problem Generator** — randomized numerical problems with worked solutions
- **FRQ Practice** — free-response prompts with rubric-style point breakdowns
- **Timed Mini-Test** — countdown timer, mixed question types, score summary
- **Formula Speed Round** — rapid-fire equation matching/recall

**Tools section** (shared, available inside every unit)
- **Equation Solver** — pick a kinematics/dynamics/etc. formula, plug in
  knowns, get the unknown
- **Unit Converter** — SI/Imperial across distance, mass, force, energy, etc.
- **Free-Body Diagram Builder** — drag-and-drop forces onto an object,
  see net force

**Simulations section**
- 2 PhET embeds relevant to the unit
- 1 custom interactive simulation (canvas/SVG) with controls

**Review section**
- **Flashcards** — 25+ per unit, flip animation, spaced-review marking
- **Worked Examples** — fully solved problems with step-by-step reasoning
- **Formula Sheet** — every equation in the unit, with variable definitions
- **Mistake Tracker** — questions the user got wrong, grouped for re-attempt

### Global pages and features

**Home page**
- Hero with the app title, animated floating physics equations drifting in the
  background, and three concentric draggable orbital rings (each can be
  flung with a pointer drag)
- Big circular **progress ring** showing overall completion across all units
- Quick stats: number of units, topics, questions, flashcards
- CTA buttons to **Study Arcade** and **Exam Mode**
- Responsive grid of 8 unit cards, each color-coded, showing progress bar,
  topic count, exam weight badge, and a hover glow that follows the cursor
- **Exam Weightage** chart — horizontal bars sized to each unit's MC weight
- **About the Exam** stats block: 40 MC, 5 FRQ, 3h, 1–5 score scale, plus
  notes on algebra-based, equation sheet, lab skills
- Footer with a "Not affiliated with College Board" line

**Study Arcade** (`/arcade`)
- Tabs: Overview, Challenges, Planner, Lab Notebook, Unlocks
- **Daily Challenge** — one rotating question per day
- **Boss Battles** — harder multi-step problems
- **Exam Block Planner** — drafts a focused practice block based on weak spots
- **Lab Notebook** — running log of solved problems / scratch
- **Unlocks** — achievements / cosmetic unlocks earned by progress
- Shareable result cards (text the user can copy)

**Exam Mode** (`/exam`)
- **Readiness Summary** — overall readiness score, recent prediction accuracy,
  recent exam trend
- **Weak Spot Radar** — radar chart of unit-level mastery
- **Recommended next block** — generated from readiness data
- **Exam Runner** — timed, AP-styled question blocks with end-of-run review

**Free-Body Diagram page** (`/free-body`) — full-screen FBD builder

**Sign-in page** (`/signin`) — auth flow (email/password and/or OAuth) so
progress can sync across devices

### Cross-cutting features

- **Authentication** with backend sync of progress, mistakes, predictions,
  and exam runs (so a signed-in user gets the same data on any device);
  signed-out users still work with everything persisted to localStorage
- **Profile menu** in the top-right with sign-in/out and account info
- **Theme toggle** — light and dark mode, system-default, smooth transitions
- **Progress tracking** for every topic in every unit, displayed everywhere
  it's relevant
- **Mistake tracking** — wrong answers from any quiz/test feed into the unit's
  Mistake Tracker
- **Insights / predictions** — the app estimates per-unit readiness and where
  the user should study next
- **KaTeX** for all math
- **Confetti** burst when a unit hits 100% (once per unit, remembered)
- **Toasts** for non-blocking feedback

### Easter eggs (please include them all)

- Triple-click the footer's "Not affiliated…" line → toast:
  *"Sir Isaac Newton is, however, affiliated with this app 🍏"*
- Press-and-hold any unit card for ~2s → small tooltip pops up with a random
  mass `m` and the corresponding weight `F = mg` (g = 9.8)
- Tilt support: on devices with orientation sensors, the floating equations
  in the hero subtly parallax with the device tilt
- Reaching 100% across **all** units shows a small "🍎 Newton's Apple" badge
  in the footer
- Hidden hover/click trick on the hero title (your choice)

### Visual / UX requirements

- Modern, dark-first aesthetic with subtle gradients, soft shadows, and
  blur/backdrop effects
- Each unit has its own brand color used consistently for icons, progress
  bars, badges, and hover glows:
  - Kinematics #3b82f6, Dynamics #ef4444, Energy #f59e0b, Momentum #8b5cf6,
    Torque #ec4899, Rotating Systems #14b8a6, Oscillations #06b6d4, Fluids #0ea5e9
- Smooth entrance animations for cards (staggered), hover lift on cards,
  animated progress rings/bars
- Accessible: keyboard navigable, focus rings, reduced-motion respected,
  semantic landmarks
- Fully responsive — phone, tablet, desktop

### Content quality bar

- Don't ship lorem-ipsum physics. Every quiz question, FRQ, flashcard, worked
  example, and formula must be real, accurate AP Physics 1 content with the
  correct answer/derivation.
- Aim for **160+ MC questions** and **200+ flashcards** across the app.
- All equations rendered with KaTeX. All units use SI by default.

### What "done" looks like

- Open the app, see the hero with the animated background and progress ring
- Click any of the 8 unit cards → land in that unit's shell with the five
  sections (Learn / Practice / Tools / Simulations / Review) and every
  feature above wired up
- Take a quiz → wrong answers appear in the unit's Mistake Tracker → the
  Weak Spot Radar in Exam Mode reflects the change
- Sign in → close the tab → reopen on another browser → progress is still
  there
- Hit 100% on a unit → confetti
- Hit 100% on every unit → 🍎 Newton's Apple badge appears

Implementation choices (framework, styling library, backend, auth provider,
file structure) are entirely up to you. Optimize for fast iteration and a
polished end result.
