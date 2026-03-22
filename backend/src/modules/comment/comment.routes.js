import { Router } from "express";
import * as commentController from "./comment.controller.js";
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsSchema,
  listRepliesSchema,
} from "./comment.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  requireAuth,
  optionalAuth,
} from "../../middlewares/auth.middleware.js";

// mergeParams: true is CRITICAL — allows access to :promptId from parent router
const router = Router({ mergeParams: true });

// ─── Comments on a prompt ─────────────────────────────────────────────────────
// GET    /prompts/:promptId/comments
// POST   /prompts/:promptId/comments
router.get(
  "/",
  optionalAuth,
  validate(listCommentsSchema, "query"),
  commentController.getPromptComments,
);
router.post(
  "/",
  requireAuth,
  validate(createCommentSchema),
  commentController.createComment,
);

// ─── Single comment actions ───────────────────────────────────────────────────
// PATCH  /prompts/:promptId/comments/:commentId
// DELETE /prompts/:promptId/comments/:commentId
router.patch(
  "/:commentId",
  requireAuth,
  validate(updateCommentSchema),
  commentController.updateComment,
);
router.delete("/:commentId", requireAuth, commentController.deleteComment);

// ─── Replies ──────────────────────────────────────────────────────────────────
// GET    /prompts/:promptId/comments/:commentId/replies
router.get(
  "/:commentId/replies",
  optionalAuth,
  validate(listRepliesSchema, "query"),
  commentController.getCommentReplies,
);

// ─── Comment likes ────────────────────────────────────────────────────────────
// POST   /prompts/:promptId/comments/:commentId/likes
// DELETE /prompts/:promptId/comments/:commentId/likes
router.post("/:commentId/likes", requireAuth, commentController.likeComment);
router.delete(
  "/:commentId/likes",
  requireAuth,
  commentController.unlikeComment,
);

export default router;
