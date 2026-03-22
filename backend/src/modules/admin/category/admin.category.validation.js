import Joi from "joi";

export const listAdminCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).optional(),
  isActive: Joi.boolean().optional(),
  parentId: Joi.string().uuid().optional().allow(null),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    "any.required": "Category name is required.",
    "string.max": "Name must be under 150 characters.",
  }),

  description: Joi.string().trim().max(500).optional().allow(""),

  parentId: Joi.string().uuid().optional().allow(null).messages({
    "string.uuid": "Invalid parent category ID.",
  }),

  isActive: Joi.boolean().default(true),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(150).optional(),
  description: Joi.string().trim().max(500).optional().allow(""),
  parentId: Joi.string().uuid().optional().allow(null),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });
