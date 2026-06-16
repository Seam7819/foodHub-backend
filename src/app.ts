import express from "express";
import cors from "cors";
import { indexRoute } from "./app/routes";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MUST be FIRST
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRoute);



export default app;