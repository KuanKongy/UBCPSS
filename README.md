# UBC Project STEM Search — Website

The official website for **UBC Project STEM Search (PSS)**, a UBC AMS club that bridges the gap between classroom learning and hands-on undergraduate research.

**Live site:** https://ubcpss.vercel.app *(update after first deploy)*

---

## 🔗 Links

| Resource | URL |
|---|---|
| Linktree | https://linktr.ee/PSSUBC |
| Instagram | https://www.instagram.com/ubc_pss/ |
| Email | pssubc@gmail.com |
| AMS Membership Form | https://docs.google.com/forms/d/e/1FAIpQLScf5hQmJ5BKwbeeHQupnHS-51tXgEBQfu-_mitP3zmwET37xA/viewform |
| GitHub Repo | https://github.com/KuanKongy/UBCPSS |

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite 5](https://vitejs.dev) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Animation | [Framer Motion 11](https://www.framer.com/motion/) |
| UI primitives | [Radix UI](https://www.radix-ui.com) (Accordion) |
| Fonts | Syne Variable · DM Sans Variable via [@fontsource](https://fontsource.org) |
| Deployment | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Fixed top nav with active-section tracking
│   │   └── Footer.tsx        # Single-row footer with land acknowledgement
│   ├── sections/
│   │   ├── Hero.tsx          # Landing hero with stats
│   │   ├── About.tsx         # What is PSS + 4 feature cards
│   │   ├── WhatWeDo.tsx      # 3 pillars / programme overview
│   │   ├── Events.tsx        # Past events timeline
│   │   ├── Testimonials.tsx  # Member quote carousel
│   │   ├── Gallery.tsx       # Event photo gallery (links to Instagram)
│   │   ├── FAQ.tsx           # Accordion FAQ
│   │   ├── GetStarted.tsx    # CTA section
│   │   └── Team.tsx          # Auto-scrolling team ticker (LinkedIn links)
│   ├── shared/
│   │   ├── BlobLayer.tsx     # Per-section SVG blob backgrounds
│   │   ├── ScrollReveal.tsx  # Fade-in-on-scroll wrapper
│   │   ├── Sparkle.tsx       # Decorative sparkle animation
│   │   ├── StatCounter.tsx   # Animated number counter
│   │   └── WaveTransition.tsx# Wave SVG between sections
│   └── ui/
│       └── LinkButton.tsx    # Reusable button/link component
├── lib/
│   ├── data.ts               # All content: team, testimonials, events, FAQ
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # cn() helper
└── index.css                 # Global styles + Tailwind directives
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## ✏️ Updating Content

All site content lives in **`src/lib/data.ts`** — no component edits needed for most updates.

| What to update | Where in data.ts |
|---|---|
| Team members & LinkedIn URLs | `TEAM_MEMBERS` array |
| Testimonial quotes | `TESTIMONIALS` array |
| Past events | `EVENTS` array |
| FAQ questions | `FAQ_ITEMS` array |
| About cards | `ABOUT_CARDS` array |
| Social/external links | `LINKS` object (top of file) |
| Stats (members, placements) | `STATS` array |

---

## 🌐 Deploying to Vercel

The project is pre-configured for Vercel with `vercel.json`.

### First deploy (via CLI)

```bash
npm i -g vercel
vercel
```

Follow the prompts — Vercel auto-detects Vite. Accept all defaults.

### First deploy (via Dashboard)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `KuanKongy/UBCPSS` GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

### Subsequent deploys

Push to `main` — Vercel auto-deploys on every push.

### Environment variables

No environment variables are required. All content is static.

---

## 🎨 Design Tokens

Colours are defined in `tailwind.config.ts` under `theme.extend.colors.pss`:

| Token | Hex | Usage |
|---|---|---|
| `pss-100` | `#D0E8F5` | Page backgrounds |
| `pss-500` | `#4A7A9B` | Body text, muted |
| `pss-700` | `#1A3A5C` | Headings, primary buttons |
| `pss-900` | `#0F1E2E` | Footer, Team section |

---

## 📄 Land Acknowledgement

UBC Project STEM Search operates on the traditional, ancestral, and unceded territory of the xʷməθkʷəy̓əm (Musqueam) people. As we build tomorrow's research community, we acknowledge our responsibility to understand and respect Indigenous histories, lands, and cultures.

---

*Built with ❤️ by the PSS Software Team · UBC AMS Club Est. 2024*
