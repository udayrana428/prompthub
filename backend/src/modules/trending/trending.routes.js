import { Router } from "express";
import * as trendingController from "./trending.controller.js";

const router = Router();

router.get("/", trendingController.getTrending);

export default router;
