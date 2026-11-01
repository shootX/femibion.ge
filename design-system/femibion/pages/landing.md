# Homepage (`/`)

Overrides and specifics on top of `../MASTER.md`.

**Job:** tell a visitor which Femibion fits their week and let them order it on the same page.

## Section order

1. **Stage finder** (`#finder`) — badge, h1 (`hero.title`, keep the SEO keyword), description,
   three trust facts (official product, delivery across Georgia, pay on delivery), then two
   panels: the week slider and the live recommendation. This is the hero; no stock photo.
2. **How it works** — three numbered steps (it is a real sequence).
3. **Products** (`#products`) — both packs with steppers bound to the cart.
4. **Checkout** (`#order`) — form left, sticky summary right on desktop.
5. **SEO text** — the two long-form answers from `seoContent`.
6. **FAQ** (`#faq`) — six short answers, link to `/faq`.

## Editable texts that drive this page

`hero.badge`, `hero.title`, `hero.description`, `pregnancy.recommendedLabel`,
`pregnancy.stages` (the first stage with `product: 2` sets the switch week),
`products.sectionTitle/sectionSubtitle`, the whole `order` block, `seoContent`.

The admin "hero image" slot is no longer shown on the homepage.
