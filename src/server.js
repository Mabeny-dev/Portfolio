import express from "express";
import { connectDB, disconnectDB } from "../prisma/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
