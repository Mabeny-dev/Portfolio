import express from "express";
import { getHeroContent } from "../controllers/heroController.js";
import { getProjects } from "../controllers/public/projectController.js";
import { sendMessage } from "../controllers/public/contactController.js";

const router = express.Router();

router.get("/hero", getHeroContent);
router.get("/projects", getProjects);
router.post("/messages", sendMessage);

export default router;
