import Joi from "joi";

export const createTagSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "any.required": "Tag name is required.",
    "string.max": "Tag name must be under 50 characters.",
  }),
  description: Joi.string().trim().max(255).optional().allow(""),
});

export const updateTagSchema = Joi.object({
  name: Joi.string().trim().max(50),
  description: Joi.string().trim().max(255).allow(""),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided.",
  });

export const listAdminTagsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(30),
  search: Joi.string().trim().max(50).optional(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
  sortBy: Joi.string().valid("name", "popular", "latest").default("latest"),
});

export const rejectTagSchema = Joi.object({
  reason: Joi.string().trim().max(255).optional().allow(""),
});
