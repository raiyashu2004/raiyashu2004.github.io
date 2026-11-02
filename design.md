# Design System — achintya.codes

> Reference document for the current portfolio UI. Use this when making changes to stay consistent.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--bg-alt` | `#f8fafc` | Card alt backgrounds, tech tags, bento items |
| `--text-main` | `#0f172a` | Headings, body text, primary text |
| `--text-muted` | `#475569` | Descriptions, secondary text |
| `--text-light` | `#94a3b8` | Footer, subtle metadata |
| `--border` | `#e2e8f0` | Card borders, dividers |
| `--border-hover` | `#cbd5e1` | Card hover border state |
| `--accent` | `#7c3aed` | Primary accent (purple) — brand link, nav dot, badges, icons |
| `--accent-light` | `#f3e8ff` | Accent badge backgrounds, hobby icon backgrounds |

### One-off Colors (inline)

| Color | Where |
|---|---|
| `#ffa116` | LeetCode pill (background + border) |
| `#1f8acb` | Codeforces pill (background + border) |
| `#FC8019` | Swiggy project icon tint |
| `#0ea5e9` | Frontend bento icon (sky blue) |
| `#f59e0b` | DevOps bento icon (amber) |
| `#10b981` | Equalizer bars (emerald green) |
| `#2563eb` | Particle canvas accent (blue) — used in `<script>` |
| `rgb(132, 0, 255)` | Magic-bento glow/spotlight color |
| `#2AABEE` | Telegram button |
| `#5865F2` | Discord button |
| `#111827` | Music player button background |

---

## Typography

| Property | Value |
|---|---|
| **Font family** | `Inter` (300, 400, 500, 600, 700) via Google Fonts |
| **Fallback** | `system-ui, -apple-system, sans-serif` |
| **Base size** | `16px` |
| **Line height** | `1.6` |
| **Rendering** | `-webkit-font-smoothing: antialiased` |

### Type Scale

| Element | Size | Weight | Other |
|---|---|---|---|
| `h1` (hero) | `clamp(2.5rem, 5vw, 4rem)` | 700 | `letter-spacing: -0.03em`, `line-height: 1.1` |
| `.section-header` | `1.5rem` | 700 | `letter-spacing: -0.02em` |
| `.project-title` | `1.25rem` | 600 | — |
| `.nav-brand` | `1.5rem` | 700 | `letter-spacing: -0.02em` |
| `.hero p` | `1.25rem` | 400 | `color: --text-muted`, `max-width: 600px` |
| `.project-desc` | `0.95rem` | 400 | `color: --text-muted` |
| `.social-pill` | `0.8rem` | 600 | — |
| `.tech-tag` | `0.75rem` | 600 | `color: --text-muted` |
| `.accent-bg` (badge) | `0.875rem` | 600 | — |
| `.splash-name` | `3.5rem` | 800 | `letter-spacing: -0.04em` |
| `.splash-subtitle` | `0.9rem` | 400 | `font-family: monospace` |
| `footer` | `0.875rem` | 400 | `color: --text-light` |

---

## Spacing & Layout

| Token | Value |
|---|---|
| `--radius` | `16px` (all cards, bento items) |
| **Container** | `max-width: 900px`, `padding: 0 1.5rem`, centered |
| **Nav margin-bottom** | `4rem` |
| **Section header margin-top** | `5rem` |
| **Card padding** | `2rem` |
| **Grid gap** | `1.5rem` |

---

## Page Sections (index.html)

### 1. Splash Screen
- Full-viewport fixed overlay (`z-index: 99999`)
- Name fades in at 0.2s, subtitle at 0.4s, loader at 0.6s
- Loading bar fills over 1.4s with `cubic-bezier(0.85, 0, 0.15, 1)`
- After 2.2s, slides up via `translateY(-100%)` over 0.9s, then removed from DOM
- Body has `overflow: hidden` during splash

### 2. Particle Network Canvas
- Full-viewport fixed `<canvas>` at `z-index: -1`
- ~100 particles (capped at `width * height / 12000`)
- Particle color: `#2563eb` (blue)
- Connection lines drawn between particles within 140px
- Mouse interaction: particles attract toward cursor within 180px radius
- Lines also drawn from particles to mouse position

### 3. Navigation
- Flexbox row: brand left, social pills right
- Brand: "Achintya" + purple dot "."
- Pills: Blog (accent-styled), GitHub, LinkedIn
- Blog pill has custom inline style: accent border + accent-light bg

### 4. Hero
- 125×125 circular avatar with purple ring + blue glow shadow
- Hover: `scale(1.05) rotate(2deg)` with enhanced glow
- Typing text cycles: "Data Scientist", "Backend Engineer", "Software Developer", "Problem Solver"
- Blinking cursor: 3px solid accent, `step-end` animation at 0.75s
- Purple `.accent-bg` badge wrapping the typing text
- `h1`: "Building intelligent systems that matter."
- `p`: Long paragraph about being a Data Scientist / AI Researcher
- Action pills: LeetCode (orange), Codeforces (blue), Download Resume (dark)

### 5. Projects ("Featured Work")
- 2-column grid (`grid-2`), 5 project cards
- Each card has:
  - `.project-header`: title left, icon box right (48×48, accent color, 12px radius)
  - `.project-desc`: one-liner summary
  - Architecture/Explanation block: `0.85rem`, muted color, bold labels
  - `.tech-tags`: row of small pills
  - `.project-links`: "Case Study →" (accent) + "Live Demo" + "GitHub" (muted)
- Projects: TransitOps, NOMADIX, STRATEGOS, JurisAI, Swiggy MERN Platform

### 6. Tech Stack
- Section uses the bento grid layout (4-column)
- `.bento-section` wraps the grid for magic-bento spotlight scope
- All bento items have: `magic-bento-card`, `magic-bento-card--border-glow`, `particle-container`
- **Large box** (2×2): "AI & Data Science" — icon, title, description, tech tags with white bg + border
- **Wide box** (2×1): "Backend Engineering"
- **Square boxes** (1×1 each): "Frontend" (sky blue icon), "DevOps" (amber icon)
- Mobile: collapses to single column

### 7. Logo Loop (Marquee)
- Infinite horizontal scroll of tech labels
- Speed: 100px/s, hover speed: 20px/s
- Items: PostgreSQL, Python, React, Node.js, Docker
- Each item has a generic SVG icon + text label
- Fade edges on left/right via `::before`/`::after` gradients
- Scale-on-hover: `1.1` with accent border + shadow

### 8. Beyond the Code (Hobbies)
- 2-column grid
- **Left**: Music player card
  - "Currently Listening To" header with music note icon
  - Play status text: "Click to Play" / "Click to Pause"
  - `<audio>` element with `song.mp3`, looped
  - Player widget: 48×48 dark play/pause button, song info, 4 EQ bars
  - EQ bars animate between 4px and 16px height when playing
  - Play/pause icon toggle via `.playing` class
- **Right**: Stack of two cards
  - "Currently Reading": book icon, "Meditations" by Marcus Aurelius
  - "Currently Exploring": compass icon, "Novel NLP Evaluation Metrics"

### 9. Contact Banner
- Centered card with accent-alt background
- `h2`: "Let's build together."
- `p`: "I'm currently open for software engineering internships..."
- 3 buttons: Email (purple accent), Telegram (#2AABEE), Discord (#5865F2)
- Each button has an inline SVG icon

### 10. Footer
- Top border, flexbox row
- "© 2025 Achintya Rai. Based in India."

---

## Animations & Interactions

| Animation | Trigger | Details |
|---|---|---|
| **Splash fade-in** | Page load | Name, subtitle, loader stagger in at 0.2s intervals |
| **Splash exit** | 2.2s timeout | `translateY(-100%)` over 0.9s cubic-bezier |
| **Fade-up** | Scroll (IntersectionObserver, 10% threshold) | `opacity: 0 → 1`, `translateY(30px) → 0` over 0.8s |
| **Typing effect** | Continuous | Types word at 100ms/char, waits 2s, deletes at 50ms/char, cycles through 4 words |
| **Cursor blink** | Continuous | 3px right-border blinks via `step-end` at 0.75s |
| **Card hover** | Mouse enter | `translateY(-2px)`, enhanced box-shadow, border color change |
| **Avatar hover** | Mouse enter | `scale(1.05) rotate(2deg)`, glow intensifies |
| **Social pill hover** | Mouse enter | Background flips to dark, `translateY(-2px)` |
| **EQ bars** | Audio playing | 4 bars animate height `4px → 16px`, each with different `animation-delay` |
| **Particle canvas** | Continuous (rAF) | ~100 particles drift + connect within 140px, attract to mouse within 180px |

### Magic Bento Effects (GSAP-powered, desktop only)

| Effect | Details |
|---|---|
| **Global spotlight** | 800×800 radial gradient follows mouse, fades based on proximity to cards |
| **Border glow** | Radial gradient `::after` pseudo-element tracks mouse position within each card |
| **Tilt** | Cards rotate ±5° based on mouse position relative to card center |
| **Magnetism** | Cards shift 3% toward cursor |
| **Particles** | 12 glowing 4px dots spawn on hover, drift randomly, fade in/out |
| **Click ripple** | Radial gradient expands from click point, fades out over 0.8s |
| **Transform perspective** | `1000px` for 3D tilt effect |

---

## File Structure

| File | Purpose |
|---|---|
| `index.html` | Main portfolio page (636 lines) |
| `styles.css` | Core stylesheet with all design tokens and components (480 lines) |
| `magic-bento.css` | Bento card glow/spotlight/particle styles (85 lines) |
| `magic-bento.js` | GSAP-powered tilt, magnetism, particles, ripple effects (223 lines) |
| `logo-loop.css` | Infinite scroll marquee styles (142 lines) |
| `logo-loop.js` | Marquee animation with smooth velocity, hover slow-down (141 lines) |
| `blog.html` | Blog page with 3 posts |
| `transitops.html` | TransitOps case study with Mermaid diagram |
| `nomadix.html` | NOMADIX case study with Mermaid diagram |
| `strategos.html` | STRATEGOS case study |
| `jurisai.html` | JurisAI case study |
| `swiggy.html` | Swiggy case study |
| `achintya.jpg` | Profile photo |
| `song.mp3` | Audio file for music player |
| `Achintya_Rai.pdf` | Resume PDF |
| `favicon.svg` | Site favicon |
| `CNAME` | Custom domain: `achintya.codes` |

---

## External Dependencies

| Dependency | Source | Used for |
|---|---|---|
| Inter font | Google Fonts CDN | All typography |
| GSAP 3.12.2 | cdnjs | Magic bento tilt, magnetism, particles, ripple, spotlight |
| Mermaid 10 | jsDelivr (ESM) | Architecture diagrams in case study pages |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤ 768px` | Bento grid → single column. Project grid → single column. Magic bento effects disabled. |
| `≥ 640px` | Tech stack container → 3 columns |
| `≥ 768px` | `.grid-2` → 2 columns |
