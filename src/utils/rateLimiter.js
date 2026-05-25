import rateLimit from "express-rate-limit";

// Strict limiter for login endpoint (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // 5 Failed attempts per IP
  skipSuccessfulRequests: true, // Don't count successfuly requests
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },

  standardHeaders: true, // Returns rate limit headers.
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 100,
  message: {
    error: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter, apiLimiter };
