import express from "express";
import { getHeroContent } from "../controllers/heroController.js";
import { recordSiteVisit } from "../controllers/public/analyticsController.js";
import { getProjects } from "../controllers/public/projectController.js";
import { sendMessage } from "../controllers/public/contactController.js";
import { getArticlePublic } from "../controllers/public/articleController.js";
import { getTestimonialPublic } from "../controllers/public/testimonialsController.js";
import { getAboutPublic } from "../controllers/public/aboutController.js";

const router = express.Router();

// The frontend should call this once per page load to record a single visit.
router.post("/visit", recordSiteVisit);
router.get("/hero", getHeroContent);
router.get("/projects", getProjects);
router.post("/messages", sendMessage);
router.get("/articles", getArticlePublic);
router.get("/testimonials", getTestimonialPublic);
router.get("/about", getAboutPublic);

export default router;
