import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// Astro/Vite expose .env values via import.meta.env for server code, but
// packages that read Node's raw process.env directly (like @vercel/blob)
// won't see them in `astro dev` otherwise. Vercel's own runtime sets real
// process.env vars in production, so this is dev-only.
try {
  process.loadEnvFile('.env.local');
} catch {
  // .env.local not present (e.g. CI, or Vercel Blob not connected yet) — fine.
}

// Hybrid output: pages are static/prerendered by default (fast, cheap to host),
// while specific routes (the order API, dashboard) opt into server rendering
// with `export const prerender = false`. Deployed on Vercel — swap the
// adapter (e.g. for @astrojs/node) if self-hosting elsewhere instead.
export default defineConfig({
  site: 'https://pizzeria-template-ruddy.vercel.app',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [react(), tailwind({ applyBaseStyles: false })],
});
