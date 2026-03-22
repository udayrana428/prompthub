import Joi from "joi";

export const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    "any.required": "Comment content is required.",
    "string.min": "Comment cannot be empty.",
    "string.max": "Comment must be under 2000 characters.",
  }),

  // Optional: reply to a top-level comment
  parentId: Joi.string().uuid().optional().allow(null).messages({
    "string.uuid": "Invalid parent comment ID.",
  }),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    "any.required": "Content is required.",
    "string.min": "Comment cannot be empty.",
    "string.max": "Comment must be under 2000 characters.",
  }),
});

export const listCommentsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  // Only return top-level by default; replies fetched separately
  parentId: Joi.string().uuid().optional().allow("null"),
});

export const listRepliesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
