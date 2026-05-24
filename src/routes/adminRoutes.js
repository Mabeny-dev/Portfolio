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
} from "../controllers/admin/heroController.js";
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
import {
  createArticle,
  deleteArticle,
  getArticlesAdmin,
  updateArticle,
} from "../controllers/admin/articleController.js";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialAdmin,
  updateTestimonial,
} from "../controllers/admin/testimonialsController.js";
import {
  createAbout,
  deleteAbout,
  getAboutAdmin,
  updateAbout,
} from "../controllers/admin/aboutController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/admin/productsController.js";
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/admin/servicesController.js";

const router = express.Router();

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

// Articles routes
router.get("/articles", protect, getArticlesAdmin);
router.post("/articles", protect, createArticle);
router.put("/articles/:id", protect, updateArticle);
router.delete("/articles/:id", protect, deleteArticle);

// Testimonial routes
router.get("/testimonials", protect, getTestimonialAdmin);
router.post("/testimonials", protect, createTestimonial);
router.put("/testimonials/:id", protect, updateTestimonial);
router.delete("/testimonials/:id", protect, deleteTestimonial);

// About content routes
router.get("/about", protect, getAboutAdmin);
router.post("/about", protect, createAbout);
router.put("/about/:id", protect, updateAbout);
router.delete("/about/:id", protect, deleteAbout);

// Products routes
router.get("/products", protect, getAllProducts);
router.get("/products/:id", protect, getProduct);
router.post("/products", protect, createProduct);
router.put("/products/:id", protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);

// Services routes
router.get("/services", protect, getAllServices);
router.get("/services/:id", protect, getService);
router.post("/services", protect, createService);
router.put("/services/:id", protect, updateService);
router.delete("/services/:id", protect, deleteService);

export default router;
