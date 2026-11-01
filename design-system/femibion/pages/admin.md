# Admin (`/adminpc`)

The admin panel uses the shadcn/ui components in `components/ui/`, themed by the same tokens
as the storefront (`app/globals.css`): plum primary, `#f4f2f7` ground, white cards, the same
fonts. No storefront components (cart, header, stage colours) are used here.

- Keep status colours semantic and separate from the brand plum.
- z-index scale: 10 (sticky table headers), 30 (admin header), 50 (dialogs, popovers).
