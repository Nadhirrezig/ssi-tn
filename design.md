# SSI — Design System

> **Sociétés Sécurités et Solutions Informatiques**
> Single source of truth for the SSI website. Read this before touching any component.

---

## 1. Brand foundations

- **Brand**: SSI — *Sociétés Sécurités et Solutions Informatiques*
- **Language**: French (Tunisian market)
- **Sensibility**: editorial restraint, technical credibility, business trust
- **Brand anchor**: the logo. Whitespace around it. Deep blue presence.

The site exists to make SSI feel *credible and modern* in a Tunisian market where most competing MSP/security sites look dated. The differentiator is not bold design — it's **restraint and proof**.

---

## 2. Principles (the spine)

1. **Restraint over abundance.** Fewer sections, denser meaning. Whitespace is content.
2. **Typography is the design.** Type does the lifting — not graphics, gradients, or color.
3. **Numbered lists, not cards.** Services read as editorial documents, not feature grids.
4. **One accent at a time.** Deep blue carries the brand. No multi-color UI.
5. **Proof over promise.** Real names, real work, real metrics. No stock imagery, ever.
6. **Quiet motion.** Things appear; they don't perform.

When in doubt, **do less**.

---

## 3. Color

Defined as CSS variables in OKLCH (perceptually accurate; required for Tailwind v4 `@theme`).

```css
@theme {
  --color-ink:     oklch(0.24 0.08 255);   /* Deep blue from logo — text + brand */
  --color-accent:  oklch(0.62 0.16 240);   /* Electric blue (circuit) — sparingly */
  --color-paper:   oklch(0.99 0.002 250);  /* Off-white background, warm-leaning */
  --color-surface: oklch(0.97 0.005 250);  /* Subtle elevated surface */
  --color-line:    oklch(0.90 0.008 250);  /* Hairline borders */
  --color-muted:   oklch(0.48 0.015 255);  /* Secondary text */
  --color-faint:   oklch(0.70 0.010 255);  /* Tertiary text, labels */
}
```

**Usage rules:**

- Background is always `paper`. Never pure `#fff` — too cold for a Tunisian B2B audience.
- `ink` carries ~95% of text. Deep blue, not pure black.
- `accent` is reserved for: active link state, focus rings, the rare circuit-motif graphic. **Never** on backgrounds, gradients, or decorative panels.
- No greys outside `muted` / `faint`. No introduced colors (orange, green, purple) anywhere.

---

## 4. Typography

**Stack:**
- Display + body: **Geist Sans** (technical clarity, free, self-hosts via `next/font`)
- Mono: **Geist Mono** (numbered list numerals, kbd-style labels)

*Alternative if Geist feels too startup-adjacent: **IBM Plex Sans** — more institutional, equally technical.*

**Scale** (modular, fluid where it matters):

| Token       | Size                          | Line | Weight | Use                              |
|-------------|-------------------------------|------|--------|----------------------------------|
| `display`   | `clamp(3.5rem, 8vw, 7rem)`    | 0.95 | 500    | Hero — *page opening only*       |
| `h1`        | `clamp(2.5rem, 5vw, 4rem)`    | 1.05 | 500    | Page titles                      |
| `h2`        | `clamp(1.75rem, 3vw, 2.5rem)` | 1.15 | 500    | Section titles                   |
| `h3`        | `1.25rem`                     | 1.35 | 500    | Subsections                      |
| `body-lg`   | `1.125rem`                    | 1.6  | 400    | Lead paragraphs                  |
| `body`      | `1rem`                        | 1.6  | 400    | Default                          |
| `small`     | `0.875rem`                    | 1.5  | 400    | Captions, metadata               |
| `label`     | `0.75rem`                     | 1.4  | 500    | Eyebrow labels (uppercase, +0.1em) |
| `mono`      | `0.875rem`                    | 1.4  | 400    | Numerals (`01 —`)                |

**Tracking:**
- Display + h1: `-0.02em`
- Body: `0`
- Labels: `0.1em`, `uppercase`

---

## 5. Spacing

8px-based, generous defaults.

```
--space-1: 0.5rem   (8px)
--space-2: 1rem     (16px)
--space-3: 1.5rem   (24px)
--space-4: 2rem     (32px)
--space-5: 3rem     (48px)
--space-6: 4rem     (64px)
--space-7: 6rem     (96px)
--space-8: 8rem     (128px)
--space-9: 12rem    (192px)
```

**Section rhythm** (between top-level sections): `--space-8` default (128px), `--space-7` minimum.

---

## 6. Layout

- Max content width: **1200px**
- Reading width (prose): **65ch**
- Grid: 12-column, gap `--space-3` (24px)
- Side padding: `clamp(1.5rem, 5vw, 4rem)`

---

## 7. Motion

**Principles:** restrained. Appear, don't perform.

- Default duration: **400ms**
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart — soft landing)
- Stagger when used: 60–80ms between items

**Patterns:**

| Pattern              | What it does                                                  |
|----------------------|---------------------------------------------------------------|
| Reveal on scroll     | opacity 0→1 + translateY 12px→0, fires once                   |
| Hover (link, button) | opacity or color shift only                                   |
| Page transition      | Next.js 16 View Transitions, soft cross-fade ≤200ms           |
| Link underline       | `background-size` trick, grows from left                      |

**Never:**
- Bouncy springs
- Multi-axis movement
- Scroll-locked parallax
- Animated gradient text
- Cursor-following blobs
- Animated counters from 0

Always respect `prefers-reduced-motion`.

---

## 8. Component conventions

**Buttons** — only two variants:
- **Primary**: solid `ink` background, `paper` text. Border-radius `2px` max.
- **Secondary**: text only with animated underline.
- No "ghost outline" buttons. No pastel-blue pills. No leading icons unless functional.

**Links:**
- Inline (in prose): underline always visible, 1px, offset 4px.
- Navigation: no underline, hover → opacity 0.6.

**Forms:**
- Underlined inputs, no boxed fields.
- Labels above, not floating.
- Helper text below, in `faint`.

**Cards** (used sparingly — case studies only):
- 1px border in `line`, no shadow, max 2px radius.
- Desktop: image left, copy right. Mobile: stacked.

---

## 9. Imagery

- Real client work — or nothing.
- **Never** stock photography of: hooded figures, hands on keyboards, blue-lit server rooms, world maps with connection lines, padlocks-over-circuits.
- If used: documentary-style photography of the actual team / office / work.
- Trust strip logos: monochrome, set to `faint` at opacity 0.6, no hover effects.

---

## 10. Anti-patterns

This list exists because the default trajectory for any AI-built site lands on these. **None of them appear on SSI.**

- ❌ Card grid for services *(use numbered editorial list)*
- ❌ Gradient hero background
- ❌ "Trusted by 10,000+ companies" social-proof strip
- ❌ Stock imagery of any kind (see §9)
- ❌ "Ready to get started?" CTA band repeated at section bottoms
- ❌ Three-step "How it works" with circular icons
- ❌ Glass morphism / frosted glass anywhere
- ❌ Floating particles, animated backgrounds, mesh gradients
- ❌ Big rounded pill buttons in accent color
- ❌ Multi-color UI (introduced orange/green/purple tags)
- ❌ Icon next to every list item
- ❌ Giant cookie modal — quiet bottom banner only
- ❌ Five-star rating components on testimonials
- ❌ Animated counters from 0 ("99.9% uptime!")
- ❌ Hero split layout (text left, illustration right)
- ❌ Hooded-hacker silhouettes, padlock icons, matrix code rain

---

## 11. Tech conventions (Next.js 16)

- **App Router**, TypeScript strict
- **React 19.2** features available (View Transitions, useEffectEvent, Activity)
- **React Compiler 1.0** enabled
- **Tailwind v4** with CSS-first `@theme` config
- `params` and `searchParams` are **Promises** — `await` before use
- Default to Server Components; `'use client'` only when interactivity needs it
- Fonts via `next/font/google` (Geist Sans + Geist Mono)
- Images via `next/image` always
- Metadata API for SEO
- `lang="fr"` on root

**File structure:**

```
app/
├── (marketing)/
│   ├── page.tsx                                 # Accueil
│   ├── services/
│   │   ├── cybersecurite/page.tsx
│   │   └── solutions-informatiques/page.tsx
│   ├── a-propos/page.tsx
│   ├── realisations/page.tsx
│   ├── ressources/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── contact/page.tsx
├── layout.tsx
├── globals.css
└── not-found.tsx

components/
├── ui/                # Button, Link, Input — primitives
├── layout/            # Nav, Footer
└── sections/          # Page-specific composed sections

lib/
├── content/           # Static content (services, case studies)
└── utils.ts
```

---

## 12. Accessibility

- WCAG AA minimum: 4.5:1 body contrast, 3:1 large text
- All interactive elements keyboard-reachable
- Focus ring: 2px `accent` outline, 2px offset
- Respect `prefers-reduced-motion`
- Semantic HTML — `<nav>`, `<main>`, `<article>`, `<section>` used properly
- French `lang="fr"` on root, `hreflang` if locales added later

---

## 13. What this doc does not yet cover

To be added once we start building:
- Dark mode (probably not needed for SSI — flagged as decided)
- Forms with validation states
- Forum components (deferred to phase 2)
- Espace Client portal (deferred to phase 3)