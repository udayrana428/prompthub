import * as commentRepo from "./comment.repository.js";
import { notify } from "../notification/notification.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import { MSG } from "../../constants/messages.js";
import prisma from "../../db/index.js";

export const getPromptComments = async (promptId, query) => {
  const { page, limit, skip } = getPaginationParams(query);

  const [comments, total] = await Promise.all([
    commentRepo.findComments({ promptId, where: {}, skip, take: limit }),
    commentRepo.countComments(promptId, {}),
  ]);

  return buildPaginatedResponse(comments, total, page, limit);
};

export const getCommentReplies = async (commentId, query) => {
  const parent = await commentRepo.findCommentById(commentId);
  if (!parent) throw ApiError.notFound(MSG.COMMENT.NOT_FOUND);

  const { page, limit, skip } = getPaginationParams(query);

  const [replies, total] = await Promise.all([
    commentRepo.findReplies({ parentId: commentId, skip, take: limit }),
    commentRepo.countReplies(commentId),
  ]);

  return buildPaginatedResponse(replies, total, page, limit);
};

export const createComment = async (promptId, userId, data) => {
  // Verify prompt exists and is approved
  const prompt = await prisma.prompt.findFirst({
    where: { id: promptId, deletedOn: null, status: "APPROVED" },
    select: { id: true, createdById: true },
  });
  if (!prompt) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);

  // If it's a reply, verify parent comment belongs to same prompt
  if (data.parentId) {
    const parent = await commentRepo.findCommentById(data.parentId);
    if (!parent || parent.promptId !== promptId) {
      throw ApiError.badRequest("Invalid parent comment.");
    }
  }

  const comment = await commentRepo.createComment({
    promptId,
    userId,
    content: data.content,
    parentId: data.parentId || null,
  });

  // Notify prompt author (if reply, also notify parent comment author)
  notify({
    userId: prompt.createdById,
    actorId: userId,
    type: "PROMPT_COMMENT",
    referenceId: promptId,
    referenceType: "PROMPT",
  }).catch(() => {});

  if (data.parentId) {
    const parent = await commentRepo.findCommentById(data.parentId);
    if (parent && parent.userId !== userId) {
      notify({
        userId: parent.userId,
        actorId: userId,
        type: "COMMENT_REPLY",
        referenceId: comment.id,
        referenceType: "COMMENT",
      }).catch(() => {});
    }
  }

  return comment;
};

export const updateComment = async (commentId, userId, content) => {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw ApiError.notFound(MSG.COMMENT.NOT_FOUND);
  if (comment.userId !== userId)
    throw ApiError.forbidden(MSG.GENERIC.FORBIDDEN);
  if (comment.status !== "VISIBLE")
    throw ApiError.badRequest("This comment cannot be edited.");

  return commentRepo.updateComment(commentId, content);
};

export const deleteComment = async (commentId, userId) => {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw ApiError.notFound(MSG.COMMENT.NOT_FOUND);

  // Allow comment owner OR prompt owner to delete
  const prompt = await prisma.prompt.findFirst({
    where: { id: comment.promptId },
    select: { createdById: true },
  });

  const isOwner = comment.userId === userId;
  const isPromptOwner = prompt?.createdById === userId;

  if (!isOwner && !isPromptOwner)
    throw ApiError.forbidden(MSG.GENERIC.FORBIDDEN);

  await commentRepo.softDeleteComment(
    commentId,
    userId,
    comment.promptId,
    comment.parentId,
  );
};

export const likeComment = async (commentId, userId) => {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw ApiError.notFound(MSG.COMMENT.NOT_FOUND);

  const existing = await commentRepo.findCommentLike(commentId, userId);
  if (existing) throw ApiError.conflict(MSG.COMMENT.LIKED);

  await commentRepo.createCommentLike(commentId, userId);
};

export const unlikeComment = async (commentId, userId) => {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw ApiError.notFound(MSG.COMMENT.NOT_FOUND);

  const existing = await commentRepo.findCommentLike(commentId, userId);
  if (!existing) throw ApiError.conflict("You haven't liked this comment.");

  await commentRepo.deleteCommentLike(commentId, userId);
};
