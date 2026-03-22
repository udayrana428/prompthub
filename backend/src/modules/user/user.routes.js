import { Router } from "express";
import * as userController from "./user.controller.js";
import { updateProfileSchema, updateUsernameSchema, listUsersSchema, userPromptsSchema } from "./user.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth, optionalAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/",                             validate(listUsersSchema, "query"),   userController.listUsers);
router.get("/:slug",                        optionalAuth,                         userController.getPublicProfile);
router.get("/:slug/prompts",               optionalAuth, validate(userPromptsSchema, "query"), userController.getUserPrompts);

// ─── Authenticated — current user (me) ────────────────────────────────────────
router.patch("/me/profile",                requireAuth, validate(updateProfileSchema),   userController.updateMyProfile);
router.patch("/me/username",               requireAuth, validate(updateUsernameSchema),  userController.updateMyUsername);
router.patch("/me/avatar",                 requireAuth, upload.single("avatar"),         userController.updateMyAvatar);
router.patch("/me/cover-image",            requireAuth, upload.single("coverImage"),     userController.updateMyCoverImage);
router.get("/me/favorites",                requireAuth,                                  userController.getMyFavorites);
router.delete("/me",                       requireAuth,                                  userController.deleteMyAccount);

export default router;