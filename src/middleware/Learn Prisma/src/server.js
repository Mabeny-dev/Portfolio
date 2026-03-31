import express from "express";
import authRoute from "./routes/authRoute.js";
import movieRoute from "./routes/moviesRoutes.js";
import { connectDB, disconnectDB } from "../prisma/db.js";

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// API routes
app.use("/movies", movieRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
