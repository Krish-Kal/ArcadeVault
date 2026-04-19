import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';  


dotenv.config();

const app = express();



app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json()); 


import userRoutes from './routes/userRoutes.js';

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");

});
import path from "path";

app.use("/uploads", express.static(path.resolve("uploads")));

export default app;

