import express from "express";
import { getHeroContent } from "../controllers/admin/heroController.js";
import { recordSiteVisit } from "../controllers/public/analyticsController.js";
import { getProjects } from "../controllers/public/projectController.js";
import { sendMessage } from "../controllers/public/contactController.js";
import { getArticlePublic } from "../controllers/public/articleController.js";
import { getTestimonialPublic } from "../controllers/public/testimonialsController.js";
import { getAboutPublic } from "../controllers/public/aboutController.js";
import { getYearlyGitHubStats } from "../controllers/public/githubController.js";
import { getAllProductsPublic } from "../controllers/public/productsController.js";
import { getAllServicesPublic } from "../controllers/public/servicesController.js";
import { subscribe } from "../controllers/public/newsletterController.js";
import { apiLimiter, visitLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

// The frontend should call this once per page load to record a single visit.
router.post("/visit", visitLimiter, recordSiteVisit);
router.use(apiLimiter);
router.get("/hero", getHeroContent);
router.get("/projects", getProjects);
router.post("/messages", sendMessage);
router.get("/articles", getArticlePublic);
router.get("/testimonials", getTestimonialPublic);
router.get("/about", getAboutPublic);
router.get("/gitHubStats", getYearlyGitHubStats);
router.get("/products", getAllProductsPublic);
router.get("/services", getAllServicesPublic);
router.post("/subscribe", subscribe);

export default router;
