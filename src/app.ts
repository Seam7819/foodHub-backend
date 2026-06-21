import express from "express";
import cors from "cors";
import { indexRoute } from "./app/routes/index.js";
import { OrderController } from "./app/module/order/order.controller.js";

const app = express();

const normalizeOrigin = (url: string) => url.trim().replace(/\/+$/, "");

const frontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  ...frontendOrigins,
];

// CORS must be the first middleware, before body parsers and routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(null, false); // reject gracefully, don't throw
    }
  },
  credentials: true,
}));

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "*/*" }),
  OrderController.handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "FoodHub Backend is running." });
});

app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
  res.status(204).end();
});

app.use("/api", indexRoute);

// Catch-all error handler — keeps CORS headers intact on errors
// since this runs after the cors() middleware already attached them
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;