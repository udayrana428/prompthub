import Joi from "joi";

export const listTagsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(30),
  search: Joi.string().trim().max(50).optional(),
  sortBy: Joi.string().valid("name", "popular").default("popular"),
});

export const tagPromptsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid("latest", "popular").default("latest"),
});
