import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "any.required": "Role name is required.",
  }),
  code: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9_]+$/)
    .max(100)
    .required()
    .messages({
      "any.required": "Role code is required.",
      "string.pattern.base":
        "Code must be uppercase letters, numbers, or underscores only.",
    }),
  description: Joi.string().trim().max(255).optional().allow(""),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().trim().max(100),
  description: Joi.string().trim().max(255).allow(""),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided.",
  });

export const listRolesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).optional(),
  isActive: Joi.boolean().optional(),
});

export const replacePermissionsSchema = Joi.object({
  permissionIds: Joi.array()
    .items(Joi.string().uuid())
    .required()
    .messages({ "any.required": "permissionIds array is required." }),
});

export const replaceMenusSchema = Joi.object({
  menuIds: Joi.array()
    .items(Joi.string().uuid())
    .required()
    .messages({ "any.required": "menuIds array is required." }),
});
