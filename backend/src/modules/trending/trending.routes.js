import { Router } from "express";
import * as trendingController from "./trending.controller.js";
import { optionalAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", optionalAuth, trendingController.getTrending);

export default router;
