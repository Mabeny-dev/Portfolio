import express from "express";
import { getHeroContent } from "../controllers/heroController.js";

const router = express.Router();

router.get("/hero", getHeroContent);

export default router;
