import express from "express";
import { getHeroContent } from "../controllers/heroController.js";
import { recordSiteVisit } from "../controllers/public/analyticsController.js";
import { getProjects } from "../controllers/public/projectController.js";
import { sendMessage } from "../controllers/public/contactController.js";

const router = express.Router();

// The frontend should call this once per page load to record a single visit.
router.post("/visit", recordSiteVisit);
router.get("/hero", getHeroContent);
router.get("/projects", getProjects);
router.post("/messages", sendMessage);

export default router;
