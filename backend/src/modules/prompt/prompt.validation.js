import Joi from "joi";

const AIModelTypes = [
  "DALL_E",
  "STABLE_DIFFUSION",
  "MIDJOURNEY",
  "GEMINI",
  "OTHER",
];

export const createPromptSchema = Joi.object({
  title: Joi.string().trim().max(255).required().messages({
    "any.required": "Title is required.",
    "string.max": "Title must be under 255 characters.",
  }),

  promptText: Joi.string().trim().required().messages({
    "any.required": "Prompt text is required.",
  }),

  categoryId: Joi.string().uuid().required().messages({
    "string.uuid": "Invalid category ID.",
    "any.required": "Category is required.",
  }),

  shortDescription: Joi.string().trim().max(500).optional().allow(""),
  description: Joi.string().trim().optional().allow(""),

  modelType: Joi.string()
    .valid(...AIModelTypes)
    .default("OTHER")
    .messages({
      "any.only": `Model type must be one of: ${AIModelTypes.join(", ")}`,
    }),

  tags: Joi.array().items(Joi.string().trim()).max(10).default([]),
  tips: Joi.array().items(Joi.string().trim()).default([]),
  variations: Joi.array().items(Joi.string().trim()).default([]),
});

export const updatePromptSchema = Joi.object({
  title: Joi.string().trim().max(255),
  promptText: Joi.string().trim(),
  categoryId: Joi.string().uuid(),
  shortDescription: Joi.string().trim().max(500).allow(""),
  description: Joi.string().trim().allow(""),
  modelType: Joi.string().valid(...AIModelTypes),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  tips: Joi.array().items(Joi.string().trim()),
  variations: Joi.array().items(Joi.string().trim()),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });

export const listPromptsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  categoryId: Joi.string().uuid().optional(),
  category: Joi.string().trim().max(180).optional(),
  tag: Joi.string().trim().max(60).optional(),
  modelType: Joi.string()
    .valid(...AIModelTypes)
    .optional(),
  model: Joi.string()
    .valid(...AIModelTypes)
    .optional(),
  search: Joi.string().trim().max(100).optional(),
  sortBy: Joi.string().valid("latest", "popular", "trending").default("latest"),
});
