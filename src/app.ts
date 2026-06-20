import express from "express";
import cors from "cors";
import { indexRoute } from "./app/routes/index.js";


const app = express();

const frontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  ...frontendOrigins,
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MUST be FIRST
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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