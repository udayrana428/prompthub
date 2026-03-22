import Joi from "joi";

export const createPermissionSchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    "any.required": "Permission name is required.",
    "string.max": "Name must be under 150 characters.",
  }),
  code: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9_]+$/)
    .max(150)
    .required()
    .messages({
      "any.required": "Permission code is required.",
      "string.pattern.base":
        "Code must be uppercase letters, numbers, or underscores only.",
    }),
  description: Joi.string().trim().max(255).optional().allow(""),
  module: Joi.string().trim().max(100).optional().allow(""),
});

export const updatePermissionSchema = Joi.object({
  name: Joi.string().trim().max(150),
  description: Joi.string().trim().max(255).allow(""),
  module: Joi.string().trim().max(100).allow(""),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided.",
  });

export const listPermissionsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).optional(),
  module: Joi.string().trim().max(100).optional(),
  isActive: Joi.boolean().optional(),
});
