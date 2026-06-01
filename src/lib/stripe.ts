import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});

/**
 * Create a Stripe Checkout Session for challenge registration.
 *
 * @param params.priceInPaise — Amount in paise (e.g. 49900 = ₹499).
 *   Stripe INR uses paise as the smallest unit, so we pass it directly.
 * @returns The checkout session URL to redirect the user to.
 */
export async function createChallengeCheckoutSession(params: {
  userId: string;
  challengeId: string;
  registrationId: string;
  priceInPaise: number;
  challengeTitle: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    currency: 'inr',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: params.challengeTitle,
            description: '#TheWriteAngle — 21-Day Writing Challenge',
          },
          unit_amount: params.priceInPaise, // Stripe INR uses paise
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: params.userId,
      challengeId: params.challengeId,
      registrationId: params.registrationId,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session.url!;
}
