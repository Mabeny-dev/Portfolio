import express from "express";
import { getHeroContent } from "../controllers/heroController.js";
import { getProjects } from "../controllers/public/projectController.js";

const router = express.Router();

router.get("/hero", getHeroContent);
router.get("/projects", getProjects);

export default router;
