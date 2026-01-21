import type Stripe from 'stripe';
import { stripe } from 'src/lib/stripe';
import type { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Prisma, SubscriptionStatus } from 'generated/prisma/client';

export function constructStripeEvent(
  rawPayload: Buffer,
  signature: string,
  secret: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(rawPayload, signature, secret);
}

export function extractUserIdFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
): string | undefined {
  const metadata = paymentIntent.metadata ?? {};
  const userId = metadata['userId'];
  return typeof userId === 'string' && userId.length > 0 ? userId : undefined;
}

export function amountCentsFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
): number {
  if (typeof paymentIntent.amount_received === 'number')
    return paymentIntent.amount_received;
  if (typeof paymentIntent.amount === 'number') return paymentIntent.amount;
  return 0;
}

export function centsToDecimalString(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function extractStripeCustomerId(
  source: Stripe.Subscription | Stripe.Invoice,
): string | null {
  const raw = 'customer' in source ? source.customer : null;
  if (!raw) return null;
  return typeof raw === 'string' ? raw : (raw.id ?? null);
}

export async function findUserByStripeCustomerId(
  prisma: PrismaService,
  stripeCustomerId: string,
): Promise<{ id: string } | null> {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId },
    select: { id: true },
  });
  return user ?? null;
}

export async function updateSubscriptionsStatus(
  prisma: PrismaService,
  userId: string,
  status: SubscriptionStatus,
): Promise<void> {
  await prisma.subscriptions.updateMany({
    where: { userId },
    data: { status },
  });
}

export async function updateSubscriptionsPriceAndStatus(
  prisma: PrismaService,
  userId: string,
  priceDecimalString: string,
  status: SubscriptionStatus,
): Promise<void> {
  await prisma.subscriptions.updateMany({
    where: { userId },
    data: {
      price: new Prisma.Decimal(priceDecimalString),
      status,
    },
  });
}

export async function createSubscriptionRecord(
  prisma: PrismaService,
  userId: string,
  priceDecimalString: string,
  status: SubscriptionStatus,
): Promise<void> {
  await prisma.subscriptions.create({
    data: {
      userId,
      price: new Prisma.Decimal(priceDecimalString),
      status,
    },
  });
}
