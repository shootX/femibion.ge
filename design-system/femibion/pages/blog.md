# Blog (`/blog`, `/blog/[slug]`)

Overrides and specifics on top of `../MASTER.md`.

## List

- `PageIntro` with `blog.title` / `blog.subtitle`.
- Newest post is featured full width (image left, text right on desktop); the rest in a
  3-column grid of `.panel-flat` cards with date, title, excerpt.

## Article

- Reading column max 760px, centred inside `.wrap`.
- Date line, h1, cover image (22px radius), table of contents when there are ≥3 h2s.
- Body: 17.5px / 1.75 in `text-ink-soft`; h2 1.6rem, h3 1.22rem.
- A single-`#` heading in post content is skipped (the page already renders the h1).
- After the body: an order panel on `bg-f1-wash` with both packs and a link to the finder,
  then share buttons, then related posts as cards.
