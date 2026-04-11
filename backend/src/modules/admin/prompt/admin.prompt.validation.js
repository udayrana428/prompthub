import Joi from "joi";
import { AIModelType, PromptStatus } from "../../../constants/enums.js";

const modelTypes = Object.values(AIModelType);
const promptStatuses = Object.values(PromptStatus);

export const listAdminPromptsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(150).optional(),
  status: Joi.string()
    .valid(...promptStatuses)
    .optional(),
  featured: Joi.boolean().optional(),
  categoryId: Joi.string().uuid().optional(),
  createdById: Joi.string().uuid().optional(),
  modelType: Joi.string()
    .valid(...modelTypes)
    .optional(),
  sortBy: Joi.string()
    .valid("latest", "oldest", "popular", "mostViewed")
    .default("latest"),
});

export const createAdminPromptSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  promptText: Joi.string().trim().required(),
  categoryId: Joi.string().uuid().required(),
  shortDescription: Joi.string().trim().max(500).optional().allow(""),
  description: Joi.string().trim().optional().allow(""),
  modelType: Joi.string()
    .valid(...modelTypes)
    .default(AIModelType.OTHER),
  tags: Joi.array().items(Joi.string().trim()).max(10).default([]),
  tips: Joi.array().items(Joi.string().trim()).default([]),
  variations: Joi.array().items(Joi.string().trim()).default([]),
  status: Joi.string()
    .valid(...promptStatuses)
    .default(PromptStatus.APPROVED),
  featured: Joi.boolean().default(false),
  rejectionReason: Joi.string().trim().max(255).optional().allow(""),
  metaTitle: Joi.string().trim().max(255).optional().allow(""),
  metaDescription: Joi.string().trim().max(500).optional().allow(""),
});

export const updateAdminPromptSchema = Joi.object({
  title: Joi.string().trim().max(255),
  promptText: Joi.string().trim(),
  categoryId: Joi.string().uuid(),
  shortDescription: Joi.string().trim().max(500).allow(""),
  description: Joi.string().trim().allow(""),
  modelType: Joi.string().valid(...modelTypes),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  tips: Joi.array().items(Joi.string().trim()),
  variations: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid(...promptStatuses),
  featured: Joi.boolean(),
  rejectionReason: Joi.string().trim().max(255).allow(""),
  metaTitle: Joi.string().trim().max(255).allow(""),
  metaDescription: Joi.string().trim().max(500).allow(""),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });

export const updateAdminPromptStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...promptStatuses)
    .required(),
  rejectionReason: Joi.string().trim().max(255).optional().allow(""),
});

export const updateAdminPromptFeaturedSchema = Joi.object({
  featured: Joi.boolean().required(),
});
