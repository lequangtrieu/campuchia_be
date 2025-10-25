import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/database/database.js";
import messageRoutes from "./src/routes/message.route.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/messages", messageRoutes);

export default app;