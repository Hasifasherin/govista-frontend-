import { loadStripe } from "@stripe/stripe-js";

/* ================== Validate Key ================== */
const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (!publishableKey) {
  console.warn(
    "Stripe publishable key is missing. Payments will not work."
  );
}

/* ================== Stripe Loader ================== */
export const stripePromise = loadStripe(publishableKey);
