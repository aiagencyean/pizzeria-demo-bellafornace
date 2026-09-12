import type { APIRoute } from 'astro';
import { sendOrderNotification } from '@/lib/email';
import type { Order } from '@/lib/orders';

// This route needs to run per-request (to read env vars and send email),
// so it opts out of the static prerendering the rest of the site uses.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let order: Order;
  try {
    order = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!order?.id || !Array.isArray(order.items) || order.items.length === 0) {
    return new Response(JSON.stringify({ error: 'Malformed order payload' }), { status: 422 });
  }

  try {
    const result = await sendOrderNotification(order);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to send order notification email:', err);
    // The order itself was already accepted client-side (saved for the
    // dashboard); email delivery failing shouldn't block the customer's
    // confirmation, but we surface it so it's visible in logs/monitoring.
    return new Response(JSON.stringify({ error: 'Notification email failed', demoMode: false, sent: false }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
