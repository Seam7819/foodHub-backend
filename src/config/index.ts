import dotenv from "dotenv";
import fs from "fs";

const envFile = fs.existsSync(".env")
  ? ".env"
  : fs.existsSync(".vercel.env")
  ? ".vercel.env"
  : undefined;

if (envFile) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

export default {
  port: process.env.PORT,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,

    refreshSecret: process.env.JWT_REFRESH_SECRET as string,

    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,

    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
    currency: process.env.STRIPE_CURRENCY ?? "usd",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
  },

  site: {
    name: process.env.SITE_NAME ?? "FreshNest Organization",
    shortName: process.env.SITE_SHORT_NAME ?? "FreshNest",
    description:
      process.env.SITE_DESCRIPTION ??
      "FreshNest Organization delivers premium food experiences from trusted providers, with modern service, secure checkout, and AI assistance.",
    primaryColor: process.env.SITE_PRIMARY_COLOR ?? "#0f172a",
    secondaryColor: process.env.SITE_SECONDARY_COLOR ?? "#2563eb",
    accentColor: process.env.SITE_ACCENT_COLOR ?? "#f59e0b",
    themeSupport: ["LIGHT", "DARK"],
    features: [
      "Premium provider network",
      "AI-assisted support",
      "Stripe payment integration",
      "Theme selection",
      "Organization-grade reporting",
    ],
  },
};