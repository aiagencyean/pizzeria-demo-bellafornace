import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

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
