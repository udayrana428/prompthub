import * as commentService from "./comment.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const getPromptComments = asyncHandler(async (req, res) => {
  const result = await commentService.getPromptComments(
    req.params.promptId,
    req.query,
  );
  ApiResponse.success(res, result, "Comments fetched.");
});

export const getCommentReplies = asyncHandler(async (req, res) => {
  const result = await commentService.getCommentReplies(
    req.params.commentId,
    req.query,
  );
  ApiResponse.success(res, result, "Replies fetched.");
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.promptId,
    req.user.id,
    req.body,
  );
  ApiResponse.created(res, { comment }, MSG.COMMENT.CREATED);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.commentId,
    req.user.id,
    req.body.content,
  );
  ApiResponse.success(res, { comment }, MSG.COMMENT.UPDATED);
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.commentId, req.user.id);
  ApiResponse.success(res, null, MSG.COMMENT.DELETED);
});

export const likeComment = asyncHandler(async (req, res) => {
  await commentService.likeComment(req.params.commentId, req.user.id);
  ApiResponse.success(res, null, MSG.COMMENT.LIKED);
});

export const unlikeComment = asyncHandler(async (req, res) => {
  await commentService.unlikeComment(req.params.commentId, req.user.id);
  ApiResponse.success(res, null, MSG.COMMENT.UNLIKED);
});
