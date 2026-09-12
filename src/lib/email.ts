// Server-only module — imported exclusively from src/pages/api/orders.ts
// (a non-prerendered route). Sends the restaurant a formatted order
// notification email via SMTP (nodemailer), or logs a clearly-labeled
// DEMO MODE message when no SMTP credentials are configured yet.
//
// To go live: copy .env.example to .env and fill in SMTP_HOST / SMTP_USER /
// SMTP_PASSWORD / ORDER_EMAIL_TO. Any standard SMTP provider works
// (Postmark, SendGrid SMTP, Amazon SES, Google Workspace, etc.) — swap in
// a provider-specific SDK here later if preferred over SMTP.

import nodemailer from 'nodemailer';
import { restaurant } from '@/data/restaurant.config';
import { formatPrice } from '@/lib/format';
import type { Order } from '@/lib/orders';

function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function renderOrderText(order: Order): string {
  const lines = order.items
    .map((item) => {
      const size = item.size ? ` (${item.size.label})` : '';
      const extras = item.extras.length ? `\n    + ${item.extras.map((e) => e.label).join(', ')}` : '';
      return `${item.quantity}× ${item.name}${size}${extras}`;
    })
    .join('\n');

  const address = order.address
    ? `${order.address.street} ${order.address.houseNumber}\n${order.address.postalCode} ${order.address.city}`
    : `Abholung im Restaurant: ${restaurant.address.street}, ${restaurant.address.postalCode} ${restaurant.address.city}`;

  return `NEUE BESTELLUNG #${order.id}

Kunde: ${order.contact.firstName} ${order.contact.lastName}
Telefon: ${order.contact.phone}
E-Mail: ${order.contact.email}

Art: ${order.fulfilment === 'delivery' ? 'LIEFERUNG' : 'ABHOLUNG'}
${order.fulfilment === 'delivery' ? 'Lieferadresse' : 'Abholadresse'}:
${address}

ARTIKEL:
${lines}

Zwischensumme: ${formatPrice(order.subtotal)}
Lieferung: ${formatPrice(order.deliveryFee)}
Gesamt: ${formatPrice(order.total)}

Zahlungsart: ${order.paymentMethod === 'cash' ? 'Barzahlung' : order.paymentMethod === 'card' ? 'Karte' : 'PayPal'}
${order.specialInstructions ? `\nHinweise: "${order.specialInstructions}"` : ''}
`;
}

export interface SendResult {
  demoMode: boolean;
  sent: boolean;
}

export async function sendOrderNotification(order: Order): Promise<SendResult> {
  const text = renderOrderText(order);

  if (!isEmailConfigured()) {
    // DEMO MODE: no SMTP credentials configured. We do not fake a sent
    // email — we log it clearly instead so the flow is fully visible and
    // honest during development / demos.
    console.log('\n[DEMO MODE — email not sent, SMTP not configured]\n' + text);
    return { demoMode: true, sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.ORDER_EMAIL_FROM ?? `"${restaurant.name}" <no-reply@${restaurant.email.split('@')[1]}>`,
    to: process.env.ORDER_EMAIL_TO ?? restaurant.email,
    subject: `Neue Bestellung #${order.id} — ${restaurant.name}`,
    text,
  });

  return { demoMode: false, sent: true };
}
