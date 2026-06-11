import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express();
dotenv.config()


app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
}))





export default app;