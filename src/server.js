import express from "express";
import { connectDB, disconnectDB } from "../prisma/db.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
const PORT = process.env.PORT || 3000;

//Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// API routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
