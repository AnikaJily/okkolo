# Окколо — Mobile Landing

Mobile screen for the «Окколо» inclusive social project, implemented from a Figma design.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS 4 + CSS Modules
- CSS custom properties for design tokens
- Radix Dialog for mobile sheet behavior
- Embla Carousel for directions carousel

## Scripts

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
npm run preview
```

## Structure

```
src/
├── assets/images/           # logo, icons, photos
├── components/
│   ├── ui/                  # primitives reused across screens
│   │   ├── Button/
│   │   ├── IconButton/
│   │   ├── ImageActionCard/
│   │   └── Sheet/
│   ├── layout/              # app shell pieces
│   │   └── Header/
│   └── sections/            # screen sections (1 file = 1 section)
│       ├── HeroSection/
│       ├── AboutSection/
│       ├── DirectionsSection/
│       │   ├── DirectionsSection.tsx
│       │   └── DirectionCard.tsx
│       └── EventsSection/
│           ├── EventsSection.tsx
│           └── EventCard.tsx
├── data/                    # static content (mock content lives here)
│   ├── directions.ts
│   ├── events.ts
│   └── site.ts
├── styles/
│   ├── tokens.css           # design tokens (colors, spacing, radii, shadows)
│   ├── reset.css
│   └── global.css
├── App.tsx
├── App.module.css
└── main.tsx
```

### Architectural conventions

- **One component per folder** with an `index.ts` barrel; add co-located CSS Modules when styles should be shared or named.
- **Path alias** `@/*` points to `src/*` (see `tsconfig.json` and `vite.config.ts`).
- **Design tokens** are CSS custom properties in `styles/tokens.css` — never hard-code colors or radii inside components.
- **UI primitives** (`Button`, `IconButton`, `ImageActionCard`, `Sheet`) keep repeated interaction and layout patterns reusable.
- **Section components** own their layout and compose primitives — they do not reach into other sections.
- **Static content and shared site links** live in `src/data/` so swapping in an API later stays localized.
