# Bella Fornace — Pizzeria Website Template

A complete, premium pizzeria/restaurant website with a real ordering flow
(menu → customize → cart → checkout → confirmation) and a restaurant order
dashboard. Built with **Astro + React islands + Tailwind CSS**. Designed to
be reused across multiple restaurant clients by editing a handful of data
files — no component code changes required for a reskin.

## Stack

- **Astro 4** (hybrid rendering — pages are static/fast by default; the
  order-notification API route opts into server rendering)
- **React** for interactive parts (menu, product customization, cart,
  checkout, dashboard) via Astro islands
- **Tailwind CSS** for styling
- **nanostores** for cart/order state, persisted to `localStorage`
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

This works today because both pages read the same `localStorage`-backed
order store (see [`src/lib/orders.ts`](src/lib/orders.ts)), and
`@nanostores/persistent` automatically syncs `localStorage` changes across
browser tabs. That means it demos correctly with the kitchen board and the
customer page open in two tabs of the *same browser*, but — since there's
no real backend — it will **not** sync across two different devices (e.g.
a customer's phone and a kitchen tablet). For production, swap
`src/lib/orders.ts` for real API calls to a database and add a realtime
channel (WebSocket, Supabase Realtime, Pusher, etc.) so status updates push
to the customer's device too.

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
- **The dashboard and cart are localStorage-only** (per-browser, not a real
  shared backend) — fine for a demo/template, not for production order
  volume.
