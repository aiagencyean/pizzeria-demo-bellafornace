# Bella Fornace — Pizzeria Website Template

A complete, premium pizzeria/restaurant website with a real ordering flow
(menu → customize → cart → checkout → confirmation) and a restaurant order
dashboard. Built with **Astro + React islands + Tailwind CSS**. Designed to
be reused across multiple restaurant clients by editing a handful of data
files — no component code changes required for a reskin.

## Stack

- **Astro 4** (hybrid rendering — pages are static/fast by default; the
  order API route opts into server rendering)
- **React** for interactive parts (menu, product customization, cart,
  checkout, dashboard) via Astro islands
- **Tailwind CSS** for styling
- **nanostores** for cart state (`localStorage`, per-device) and order state
  (polled from the server, shared across devices)
- **Vercel Blob** as the shared "database" for orders — see
  [`src/pages/api/orders.ts`](src/pages/api/orders.ts)
- **Nodemailer** for order-notification emails (DEMO mode until configured)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. `npm run build` produces a production build;
`npm run preview` serves it locally.

## Reskinning this template for a new restaurant

Everything client-specific lives in a small number of files:

| What to change | File |
| --- | --- |
| Name, tagline, story, address, phone, hours, delivery fee/area, social links, SEO copy | [`src/data/restaurant.config.ts`](src/data/restaurant.config.ts) |
| Menu items, categories, prices, sizes, extras, images | [`src/data/menu.ts`](src/data/menu.ts) |
| Customer reviews (currently DEMO placeholders) | [`src/data/reviews.ts`](src/data/reviews.ts) |
| Gallery photos | [`src/data/gallery.ts`](src/data/gallery.ts) |
| Photos themselves | `public/images/` — swap files, keep the same paths, or update the `image` fields in the data files above |
| Brand colors & fonts | [`tailwind.config.mjs`](tailwind.config.mjs) (`colors`, `fontFamily`) |
| Logo | Currently a text wordmark in `Header.astro`/`Footer.astro`; set `restaurant.logoImage` and swap in an `<img>` once a real logo exists |

No restaurant details are hardcoded inside components — they all read from
`restaurant.config.ts` and `menu.ts`.

## Order notification emails

Order emails are OFF by default (DEMO MODE): incoming orders are logged to
the server console instead of emailed, clearly labeled as such. To go live:

1. Copy `.env.example` to `.env`
2. Fill in `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `ORDER_EMAIL_TO`
   (any standard SMTP provider works — Postmark, SES, Google Workspace, etc.)

See [`src/lib/email.ts`](src/lib/email.ts) and
[`src/pages/api/orders.ts`](src/pages/api/orders.ts).

## Deploying (Vercel)

Orders need a Vercel Blob store connected to the project (this is what
`BLOB_READ_WRITE_TOKEN` is for). For a new deployment:

```bash
vercel blob create-store <name> --access private --yes
```

Run from the project directory once it's linked to a Vercel project (`vercel link`) —
this creates the store and wires the env var into the project automatically,
in both the Vercel dashboard and (via `vercel env pull`) a local `.env.local`
for `npm run dev`.

## Kitchen dashboard & live customer status

Two pages work together as one order-tracking loop:

- **`/dashboard`** (kitchen/staff) — a kanban-style board
  (New → Preparing → Ready/Out for delivery → Completed). Each order has a
  tap-to-tick step control (only the steps relevant to that order's
  delivery/pickup type are shown) — tapping a step marks the order as
  having reached it.
- **`/order-confirmed?order=…`** (customer) — shows the same steps with
  customer-friendly wording and updates **live**, with no polling or
  refresh, whenever staff tick a step on `/dashboard`.

Orders are stored server-side in Vercel Blob (see
[`src/pages/api/orders.ts`](src/pages/api/orders.ts)) — a customer ordering
on their phone and a kitchen screen on a PC, on completely different
networks, both talk to the same backend. Both pages poll `/api/orders`
every few seconds (see `startOrderPolling` in
[`src/lib/orders.ts`](src/lib/orders.ts)) so changes show up shortly after
without a manual refresh. This is polling, not push — a few seconds of
lag is expected and fine for a restaurant kitchen; swap it for a realtime
channel (WebSocket, Supabase Realtime, Pusher, etc.) if instant updates
matter more than simplicity. The order counter and status updates aren't
handled with a database transaction, so two orders placed in the same
instant could theoretically race — an acceptable risk for a demo/small
restaurant, not something to scale up without a real database.

## Known template limitations (by design)

- **Payment is a demo.** Card/PayPal selections don't run a real
  transaction — wire up Stripe or another provider before taking real
  payments.
- **Reviews are placeholder/demo content** — replace before launch, or pull
  live reviews from Google Business Profile.
- **The map is a placeholder** — swap `LocationSection.astro`'s placeholder
  block for a real Google Maps/Mapbox embed using
  `restaurant.mapCoordinates`.
- **Impressum/Datenschutz are placeholders** — legally required content for
  a German business; get them reviewed before publishing.
- **Orders share one Blob JSON file with no transactional locking** — fine
  for a demo/small restaurant's order volume, not built to scale past that
  without moving to a real database.
- **The cart is still `localStorage`-only** (per-device, by design — a
  shopping cart shouldn't follow you across devices).
