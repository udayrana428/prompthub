import Joi from "joi";

export const createMenuSchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    "any.required": "Menu name is required.",
  }),
  code: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9_]+$/)
    .max(150)
    .required()
    .messages({
      "any.required": "Menu code is required.",
      "string.pattern.base":
        "Code must be uppercase letters, numbers, or underscores.",
    }),
  description: Joi.string().trim().max(255).optional().allow(""),
  path: Joi.string().trim().max(255).optional().allow(""),
  icon: Joi.string().trim().max(100).optional().allow(""),
  order: Joi.number().integer().min(0).default(0),
  isVisible: Joi.boolean().default(true),
  parentId: Joi.string().uuid().optional().allow(null),
  permissionId: Joi.string().uuid().optional().allow(null),
});

export const updateMenuSchema = Joi.object({
  name: Joi.string().trim().max(150),
  description: Joi.string().trim().max(255).allow(""),
  path: Joi.string().trim().max(255).allow(""),
  icon: Joi.string().trim().max(100).allow(""),
  order: Joi.number().integer().min(0),
  isVisible: Joi.boolean(),
  isActive: Joi.boolean(),
  parentId: Joi.string().uuid().allow(null),
  permissionId: Joi.string().uuid().allow(null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided.",
  });

export const reorderMenusSchema = Joi.object({
  // Array of { id, order } pairs
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        order: Joi.number().integer().min(0).required(),
      }),
    )
    .min(1)
    .required()
    .messages({ "any.required": "items array is required." }),
});

export const listMenusSchema = Joi.object({
  isActive: Joi.boolean().optional(),
  flat: Joi.boolean().default(false), // flat list vs tree
});
