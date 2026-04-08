import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/admin/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getHeroContent,
  updateHeroContent,
} from "../controllers/heroController.js";
import {
  createProject,
  deleteProject,
  getProjectsAdmin,
  updateProject,
} from "../controllers/admin/projectController.js";
import {
  getMessages,
  getMessageStats,
  markAsRead,
} from "../controllers/admin/contactController.js";
import { getSiteAnalytics } from "../controllers/admin/analyticsController.js";

const router = express.Router();

// The routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

// Hero Content
router.get("/hero", protect, getHeroContent);
router.put("/hero", protect, updateHeroContent);

// Project routes
router.post("/projects", protect, createProject);
router.get("/projects", protect, getProjectsAdmin);
router.put("/projects/:id", protect, updateProject);
router.delete("/projects/:id", protect, deleteProject);

// Message routes
router.get("/messages", protect, getMessages);
router.get("/messages/stats", protect, getMessageStats);
router.put("/messages/:id", protect, markAsRead);

// Analytics routes
router.get("/analytics/site-visits", protect, getSiteAnalytics);

export default router;
