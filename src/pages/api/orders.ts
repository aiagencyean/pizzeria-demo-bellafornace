import type { APIRoute } from 'astro';
import { get, put } from '@vercel/blob';
import { sendOrderNotification } from '@/lib/email';
import type { NewOrderInput, Order, OrderStatus } from '@/lib/orders';

// This route needs to run per-request (reads/writes shared Blob storage,
// sends email), so it opts out of the static prerendering the rest of the
// site uses.
export const prerender = false;

// A single JSON file acting as the shared "database" for this demo. It's
// what makes the kitchen dashboard and a customer's phone see the same
// orders even on different devices/networks — see src/lib/orders.ts for
// the client side of this. A production build would swap this for a real
// database; this keeps the template deployable with zero extra setup
// beyond the Vercel Blob store already connected to the project.
const BLOB_PATH = 'bella-fornace-orders.json';

interface OrdersData {
  nextId: number;
  orders: Order[];
}

async function readOrdersData(): Promise<OrdersData> {
  try {
    const result = await get(BLOB_PATH, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) return { nextId: 1049, orders: [] };
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as OrdersData;
  } catch {
    return { nextId: 1049, orders: [] };
  }
}

async function writeOrdersData(data: OrdersData): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(data), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export const GET: APIRoute = async () => {
  const data = await readOrdersData();
  return new Response(JSON.stringify({ orders: data.orders }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  let input: NewOrderInput;
  try {
    input = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!Array.isArray(input?.items) || input.items.length === 0) {
    return new Response(JSON.stringify({ error: 'Malformed order payload' }), { status: 422 });
  }

  const data = await readOrdersData();
  const order: Order = {
    ...input,
    id: String(data.nextId),
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  data.orders.unshift(order);
  data.nextId += 1;
  await writeOrdersData(data);

  let notification = { demoMode: true, sent: false };
  try {
    notification = await sendOrderNotification(order);
  } catch (err) {
    console.error('Failed to send order notification email:', err);
    // The order is already saved — email delivery failing shouldn't block
    // the customer's confirmation.
  }

  return new Response(JSON.stringify({ order, ...notification }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  let body: { id: string; status: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!body?.id || !body?.status) {
    return new Response(JSON.stringify({ error: 'id and status are required' }), { status: 422 });
  }

  const data = await readOrdersData();
  const exists = data.orders.some((o) => o.id === body.id);
  if (!exists) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
  }

  data.orders = data.orders.map((o) => (o.id === body.id ? { ...o, status: body.status } : o));
  await writeOrdersData(data);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
