# Femibion Georgia — Design System ("გზამკვლევი")

> **Logic:** when building a page, read this file first, then `pages/<page>.md` if it exists.
> A page file only lists deviations from this master.
>
> **Source of truth for values:** `app/globals.css` (tokens + `@font-face`). This file explains them.

**Direction:** the store is a guide, not a shelf. The homepage opens with the question every
customer has ("which Femibion do I need?") and answers it live with a week slider, then lets
them buy without leaving the page. Calm, clear, app-like; colour always means something.

---

## Colour

Brand anchors are sampled from the logo and the two packs. **Stage colours are semantic:**
yellow always means Femibion 1 (planning – week 12), amber always means Femibion 2
(week 13 – lactation). Never use them as decoration.

| Token | Hex | Tailwind | Use |
| --- | --- | --- | --- |
| `--primary` | `#522878` | `bg-primary`, `text-primary` | Logo plum. Primary buttons, links, focus ring. |
| `--primary-hover` | `#43205f` | `bg-primary-hover` | Hover on primary buttons. |
| `--foreground` | `#1f1729` | `text-foreground` | Body text, headings, dark cart pill. |
| `--ink-soft` | `#3a3244` | `text-ink-soft` | Long-form reading text (articles, legal). |
| `--muted-foreground` | `#615a6b` | `text-muted-foreground` | Secondary text (6:1 on background). |
| `--background` | `#f4f2f7` | `bg-background` | Page ground. |
| `--card` | `#ffffff` | `bg-card` | Panels and cards. |
| `--border` | `#e9e4ef` | `border-border` | Card outlines, dividers. |
| `--input` | `#978ca6` | `border-input` | Form control borders (≈3:1 on white). |
| `--f1` / `--f1-wash` / `--f1-ink` | `#f2a91f` / `#fff2d6` / `#6b4500` | `bg-f1`, `bg-f1-wash`, `text-f1-ink` | Femibion 1: slider track, pack tiles, stage chips. |
| `--f2` / `--f2-wash` / `--f2-ink` | `#e27a12` / `#fde6d1` / `#7c3900` | `bg-f2`, `bg-f2-wash`, `text-f2-ink` | Femibion 2: same roles. |
| `--destructive` | `#b42318` | `text-destructive` | Form errors only. |

Text on a wash uses the matching `-ink` (≥7:1). Pack photos sit on washes with
`mix-blend-multiply` so their white background disappears.

## Typography

Self-hosted variable fonts (`public/fonts/`, SIL OFL), split by `unicode-range`:

- **Bricolage Grotesque** — Latin, digits and the ₾ sign. Its optical sizes make the big
  week readout and prices feel drawn rather than typed.
- **Noto Sans Georgian** — all Georgian text, including Mtavruli.

One stack for everything: `font-sans` = Bricolage → Noto Sans Georgian → system.

| Role | Size / weight | Notes |
| --- | --- | --- |
| Hero h1 | 2rem → 3.2rem / 700 | `tracking-[-0.02em]`, `break-words` (long Georgian words) |
| Inner page h1 (`PageIntro`) | 1.8rem → 2.9rem / 700 | |
| Section h2 (`.section-heading`) | 1.75rem → 2.35rem / 700 | |
| Week readout | 5rem → 7.5rem / 800 | `tabular-nums`, `tracking-[-0.05em]` |
| Eyebrow (`.eyebrow`) | 12.5px / 700 | uppercase, `tracking-[0.07em]` |
| Body | 16–17px / 400 | `leading-relaxed`; articles 17.5px / 1.75 |

Prices and quantities always use `tabular-nums`.

## Shape, depth, spacing

- Radii: panels **22px**, buttons **14px**, inputs and steppers **12px**, chips full.
- `.panel` — white, soft shadow (`--shadow-panel`): the one or two things that matter on screen.
- `.panel-flat` — white, 1px border, no shadow: everything else (cards, form, FAQ list).
- Content width: `.wrap` (max 1180px, ≥20px side gutter incl. safe areas).
- Sections: `py-12 md:py-16` on the homepage; inner pages `pt-6 md:pt-8`.
- Group spacing with `gap`, not margins.

## Components

| Component | File | Notes |
| --- | --- | --- |
| Cart state | `components/femibion/cart.tsx` | `CartProvider` in the root layout, saved in `localStorage` (`femibion-cart-v1`). Fires GA4 `add_to_cart` + Meta `AddToCart`. |
| Header | `header.tsx` | Logo, 4 links, dark cart pill (count badge + total), phone menu, phone cart bar (hides while `#order` is on screen). |
| Stage finder | `stage-finder.tsx` | Week slider 0–41 (0 = planning, 41 = lactation), stage shortcuts, live recommendation with pack crossfade. Switch week comes from the editable `pregnancy.stages`. |
| Add to cart | `AddToCartButton` in `stage-finder.tsx` | Confirms in place ("დამატებულია") for 1.3s. |
| Qty stepper | `qty-stepper.tsx` | −/+ bound to the cart; shows "ამოიწურა" when stock is 0. |
| Checkout | `order-form.tsx` | Inline validation on submit, focus moves to the first error; city autocomplete (combobox, keyboard), confirm dialog, same `submitOrder` action and analytics as before. |
| FAQ | `faq-accordion.tsx` | One accordion for the homepage and `/faq`. |
| Inner pages | `page-intro.tsx`, `site-breadcrumbs.tsx` | |

Buttons: `.btn-primary` (plum) for the one action per area, `.btn-ghost` for secondary.

## Motion

Based on Emil Kowalski's rules (transform/opacity only, ease-out, < 300ms for UI):

- `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-drawer: cubic-bezier(.32,.72,0,1)`.
- Press feedback: `press` utility → `scale(.97)` on `:active`.
- One load moment: `.rise` on the homepage hero (stagger 70ms). Nothing else animates on scroll.
- Pack crossfade in the recommendation (280ms, small blur to mask the swap).
- Phone cart bar slides up with the drawer curve.
- `prefers-reduced-motion` collapses all of it.

## Rules

- Colour encodes stage; never put f1/f2 colours on something unrelated to a pack.
- No emoji icons (Lucide only), no gradients, no decorative numbering.
- Every control ≥44px tall on touch, visible focus ring, labels on every input.
- Don't hide content behind scroll-triggered reveals; the page must read correctly at rest.
- Don't claim what the packaging doesn't (no "medical certified", no outdated manufacturer).
