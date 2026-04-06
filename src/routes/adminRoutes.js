import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/admin/authController.js";
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

const router = express.Router();

// The routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Hero Content
router.get("/hero", getHeroContent);
router.put("/hero", updateHeroContent);

// Project routes
router.post("/projects", createProject);
router.get("/projects", getProjectsAdmin);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

export default router;
