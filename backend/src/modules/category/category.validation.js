import Joi from "joi";

export const listCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  search: Joi.string().trim().max(100).optional(),
  parentId: Joi.string().uuid().optional().allow("null"),
  isActive: Joi.boolean().optional(),
});

export const categoryPromptsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid("latest", "popular", "trending").default("latest"),
  modelType: Joi.string()
    .valid("DALL_E", "STABLE_DIFFUSION", "MIDJOURNEY", "GEMINI", "OTHER")
    .optional(),
});
