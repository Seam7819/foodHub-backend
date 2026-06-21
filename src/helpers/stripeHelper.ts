import Stripe from "stripe";
import config from "../config/index.js";

let stripeClient: Stripe | null = null;

const getStripe = (): Stripe => {
  if (stripeClient) return stripeClient;

  if (!config.stripe.secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable"
    );
  }

  stripeClient = new Stripe(config.stripe.secretKey, {
    apiVersion: "2023-10-16",
  });

  return stripeClient;
};

export default getStripe;
