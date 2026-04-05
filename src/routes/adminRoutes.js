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

const router = express.Router();

// The routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Hero Content
router.get("/hero", getHeroContent);
router.put("/hero", updateHeroContent);

export default router;
