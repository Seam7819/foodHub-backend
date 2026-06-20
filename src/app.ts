import express from "express";
import cors from "cors";
import { indexRoute } from "./app/routes/index.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MUST be FIRST
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "FoodHub Backend is running." });
});

app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
  res.status(204).end();
});

app.use("/api", indexRoute);

export default app;