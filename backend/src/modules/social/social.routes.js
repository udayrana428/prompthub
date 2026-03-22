import { Router } from "express";
import * as socialController from "./social.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:userId/followers", socialController.getFollowers);
router.get("/:userId/following", socialController.getFollowing);
router.post("/:userId/follow", requireAuth, socialController.followUser);
router.delete("/:userId/follow", requireAuth, socialController.unfollowUser);

export default router;
