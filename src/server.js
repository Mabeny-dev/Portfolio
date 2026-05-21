import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "../prisma/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const getAllowedOrigins = () => {
  const configuredOrigins =
    process.env.CLIENT_URLS || process.env.CLIENT_URL || process.env.CORS_ORIGIN;

  if (configuredOrigins) {
    return configuredOrigins
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  if (process.env.NODE_ENV === "production") {
    return [];
  }

  return ["http://localhost:8080", "http://localhost:3000"];
};

const requiredEnvironmentVariables = ["DATABASE_URL", "JWT_SECRET"];
for (const variable of requiredEnvironmentVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is required`);
  }
}

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Trust proxy headers so req.ip reflects the original client IP in deployment.
app.set("trust proxy", true);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down.`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer().catch(async (error) => {
  console.error("Failed to start server:", error);
  await disconnectDB();
  process.exit(1);
});
