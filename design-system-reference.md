# Design System Reference

> **Portfolio Website — John Mabeny**
> Stack: React 18 · Tailwind CSS v3 · Express.js · Prisma ORM · PostgreSQL

---

## 1. Design Philosophy

**Aesthetic:** Warm minimalism with an editorial feel.
**Tone:** Professional, refined, confident — not flashy.
**Differentiator:** Gold accent on warm monochrome. Feels like a curated magazine, not a generic dev portfolio.

---

## 2. Typography

### Font Families

| Role       | Font              | Fallbacks               | Import |
|------------|-------------------|-------------------------|--------|
| **Headings** | Playfair Display | Georgia, serif          | Google Fonts |
| **Body**     | Inter            | system-ui, sans-serif   | Google Fonts |

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
```

### Tailwind Config

```ts
fontFamily: {
  serif: ["'Playfair Display'", "Georgia", "serif"],
  sans: ["'Inter'", "system-ui", "sans-serif"],
}
```

### Usage Rules

- **All `<h1>`–`<h6>`** use `font-serif` (Playfair Display) — applied globally in `index.css`.
- **Body text, labels, buttons, nav** use `font-sans` (Inter) — the default `body` font.
- Never mix heading font into body text or vice versa.

### Recommended Sizes

| Element      | Tailwind Class         | Approx Size |
|--------------|------------------------|-------------|
| Hero H1      | `text-4xl md:text-6xl` | 36px / 60px |
| Section H2   | `text-3xl md:text-4xl` | 30px / 36px |
| Card Title   | `text-xl` or `text-2xl`| 20px / 24px |
| Body         | `text-base`            | 16px        |
| Small / Meta | `text-sm`              | 14px        |
| Badge / Tag  | `text-xs`              | 12px        |

---

## 3. Color Palette

### Light Mode

| Token                  | CSS Variable             | HSL                    | HEX       | Usage                        |
|------------------------|--------------------------|------------------------|-----------|------------------------------|
| Background             | `--background`           | 40, 20%, 97%           | `#f8f7f5` | Page background              |
| Foreground             | `--foreground`           | 30, 10%, 10%           | `#1c1916` | Primary text                 |
| Card                   | `--card`                 | 40, 15%, 95%           | `#f4f2f0` | Card surfaces                |
| Card Foreground        | `--card-foreground`      | 30, 10%, 10%           | `#1c1916` | Text on cards                |
| Primary                | `--primary`              | 30, 10%, 10%           | `#1c1916` | Buttons, key UI              |
| Primary Foreground     | `--primary-foreground`   | 40, 20%, 97%           | `#f8f7f5` | Text on primary bg           |
| Secondary              | `--secondary`            | 35, 10%, 90%           | `#e8e5e2` | Secondary surfaces           |
| Secondary Foreground   | `--secondary-foreground` | 30, 10%, 20%           | `#38332d` | Text on secondary bg         |
| Muted                  | `--muted`                | 35, 8%, 92%            | `#eceae8` | Subtle backgrounds           |
| Muted Foreground       | `--muted-foreground`     | 30, 5%, 50%            | `#857f79` | Secondary/hint text          |
| **Accent (Gold)**      | `--accent`               | 38, 80%, 55%           | `#e8a430` | Highlights, links, CTAs      |
| Accent Foreground      | `--accent-foreground`    | 30, 10%, 10%           | `#1c1916` | Text on accent bg            |
| Destructive            | `--destructive`          | 0, 84.2%, 60.2%        | `#ee4444` | Errors, delete actions       |
| Border                 | `--border`               | 35, 10%, 88%           | `#e3e0dd` | Dividers, card borders       |
| Ring                   | `--ring`                 | 38, 80%, 55%           | `#e8a430` | Focus rings                  |

### Dark Mode

| Token                  | CSS Variable             | HSL                    | HEX       | Usage                        |
|------------------------|--------------------------|------------------------|-----------|------------------------------|
| Background             | `--background`           | 30, 10%, 7%            | `#131110` | Page background              |
| Foreground             | `--foreground`           | 35, 15%, 90%           | `#e9e6e1` | Primary text                 |
| Card                   | `--card`                 | 30, 10%, 10%           | `#1c1916` | Card surfaces                |
| Card Foreground        | `--card-foreground`      | 35, 15%, 90%           | `#e9e6e1` | Text on cards                |
| Primary                | `--primary`              | 35, 15%, 90%           | `#e9e6e1` | Buttons, key UI              |
| Primary Foreground     | `--primary-foreground`   | 30, 10%, 7%            | `#131110` | Text on primary bg           |
| Secondary              | `--secondary`            | 30, 8%, 15%            | `#292623` | Secondary surfaces           |
| Secondary Foreground   | `--secondary-foreground` | 35, 15%, 85%           | `#ded9d3` | Text on secondary bg         |
| Muted                  | `--muted`                | 30, 8%, 15%            | `#292623` | Subtle backgrounds           |
| Muted Foreground       | `--muted-foreground`     | 35, 8%, 55%            | `#958d83` | Secondary/hint text          |
| **Accent (Gold)**      | `--accent`               | 38, 80%, 55%           | `#e8a430` | Same across both modes       |
| Accent Foreground      | `--accent-foreground`    | 30, 10%, 7%            | `#131110` | Text on accent bg            |
| Destructive            | `--destructive`          | 0, 62.8%, 30.6%        | `#7f1d1d` | Errors (darker in dark mode) |
| Border                 | `--border`               | 30, 8%, 18%            | `#312d2a` | Dividers, card borders       |
| Ring                   | `--ring`                 | 38, 80%, 55%           | `#e8a430` | Focus rings                  |

### How to Use Colors in Tailwind

```tsx
// ✅ CORRECT — use semantic tokens
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
<span className="text-accent" />
<p className="text-muted-foreground" />

// ❌ WRONG — never hardcode colors
<div className="bg-white text-black" />
<span className="text-yellow-500" />
```

---

## 4. Spacing & Layout

### Container

```ts
container: {
  center: true,
  padding: "2rem",
  screens: { "2xl": "1400px" },
}
```

### Consistent Spacing Scale

| Context              | Tailwind Classes                    |
|----------------------|-------------------------------------|
| Page horizontal pad  | `px-6 md:px-12 lg:px-16`           |
| Section vertical pad | `py-16` or `py-24`                 |
| Card inner padding   | `p-6`                              |
| Gap between items    | `gap-4`, `gap-6`, `gap-8`          |
| Section divider      | `<div className="h-px bg-border">` |

### Border Radius

```ts
borderRadius: {
  lg: "var(--radius)",          // 0.375rem = 6px
  md: "calc(var(--radius) - 2px)", // 4px
  sm: "calc(var(--radius) - 4px)", // 2px
}
```

---

## 5. Animations

### Keyframes (Tailwind Config)

| Name             | Effect                         | Duration | Easing       |
|------------------|--------------------------------|----------|--------------|
| `accordion-down` | Height 0 → full               | 0.2s     | ease-out     |
| `accordion-up`   | Height full → 0               | 0.2s     | ease-out     |
| `fade-in`        | Opacity 0 + translateY(12px)  | 0.6s     | ease-out     |

### Framer Motion Conventions

```tsx
// Standard page/section entrance
initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}

// Image/hero reveal (slightly slower)
initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
```

**Easing curve:** `[0.16, 1, 0.3, 1]` — a fast-start, gentle-land cubic bezier used throughout.

### Hover Transitions

```tsx
// Buttons & interactive elements
className="hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"

// Image zoom on hover
whileHover={{ scale: 1.04 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
```

---

## 6. Component Patterns

### Buttons

| Variant       | Appearance                                 |
|---------------|--------------------------------------------|
| `default`     | Solid primary bg, light text               |
| `outline`     | Bordered, transparent bg                   |
| `secondary`   | Soft secondary bg                          |
| `ghost`       | No bg, hover reveals accent                |
| `link`        | Underlined text link                       |
| `destructive` | Red bg for danger actions                  |

Sizes: `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10)

### Cards

- Use `<Card>` from shadcn/ui — auto-themed with `bg-card text-card-foreground border shadow-sm`.
- Inner structure: `CardHeader` → `CardTitle` + `CardDescription` → `CardContent` → `CardFooter`.

### Scroll Reveal

Use the custom `useScrollReveal()` hook for sections that animate in on scroll:

```tsx
const reveal = useScrollReveal();
<div ref={reveal.ref} className={reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}>
```

---

## 7. Dark Mode

- Implemented via CSS class strategy: `darkMode: ["class"]`
- Toggle adds/removes `.dark` on `<html>`.
- Custom `useTheme()` hook manages the toggle and persists preference.
- **All components auto-adapt** — no conditional dark-mode logic needed if you use semantic tokens.

---

## 8. Project Architecture

```
src/
├── assets/            # Static images (profile photo, etc.)
├── components/
│   ├── ui/            # shadcn/ui primitives (Button, Card, Input, etc.)
│   ├── admin/         # Admin dashboard tab components
│   ├── Navbar.tsx     # Site navigation
│   ├── Footer.tsx     # Site footer
│   ├── PageLayout.tsx # Shared layout wrapper (Navbar + Footer)
│   └── ...            # Feature components (Testimonials, TypewriterText, etc.)
├── hooks/             # Custom hooks (useTheme, useScrollReveal, useMobile)
├── lib/
│   ├── utils.ts       # cn() helper for Tailwind class merging
│   └── contentStore.ts # Local content data (will migrate to Prisma/DB)
├── pages/             # Route-level page components
│   ├── Index.tsx      # Home page
│   ├── Projects.tsx
│   ├── Articles.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── App.tsx            # Router + providers
├── main.tsx           # Entry point
└── index.css          # Design tokens + Tailwind directives
```

---

## 9. Backend Architecture (Express + Prisma)

### Database Models (from schema.prisma)

| Model           | Purpose                              |
|-----------------|--------------------------------------|
| `User`          | Auth + admin management              |
| `HeroContent`   | Homepage hero section data           |
| `Project`       | Portfolio projects                   |
| `Article`       | Blog/article posts                   |
| `Testimonial`   | Client testimonials                  |
| `AboutContent`  | Bio + skills + experience + education|
| `ContactMessage` | Contact form submissions            |

### API Route Conventions (recommended)

```
GET    /api/hero          → HeroContent
GET    /api/projects      → Project[]
GET    /api/articles      → Article[]
GET    /api/testimonials  → Testimonial[]
GET    /api/about         → AboutContent (with relations)
POST   /api/contact       → Create ContactMessage
POST   /api/auth/login    → Authenticate user
```

### Express Middleware Stack (recommended)

```
cors → helmet → express.json → routes → errorHandler
```

---

## 10. Key Dependencies

| Package              | Purpose                        |
|----------------------|--------------------------------|
| `react-router-dom`  | Client-side routing            |
| `framer-motion`     | Animations                     |
| `@tanstack/react-query` | Server state management    |
| `react-hook-form` + `zod` | Form handling + validation |
| `lucide-react`      | Icon library                   |
| `tailwindcss-animate` | Tailwind animation utilities |
| `sonner`            | Toast notifications            |
| `shadcn/ui`         | Component library (via radix)  |

---

## Quick Reference Card

```
Background:  #f8f7f5 (light)  /  #131110 (dark)
Text:        #1c1916 (light)  /  #e9e6e1 (dark)
Accent Gold: #e8a430 (both modes)
Border:      #e3e0dd (light)  /  #312d2a (dark)
Error Red:   #ee4444 (light)  /  #7f1d1d (dark)

Heading Font: Playfair Display (serif)
Body Font:    Inter (sans-serif)

Border Radius: 6px (lg) / 4px (md) / 2px (sm)
Container Max: 1400px, centered, 2rem padding
```
