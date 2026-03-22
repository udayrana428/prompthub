import Joi from "joi";

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(100).optional().allow(""),
  lastName: Joi.string().trim().max(100).optional().allow(""),
  displayName: Joi.string().trim().max(150).optional().allow(""),
  bio: Joi.string().trim().max(500).optional().allow(""),
  website: Joi.string().trim().uri().max(255).optional().allow(""),
  location: Joi.string().trim().max(150).optional().allow(""),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });

export const updateUsernameSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(50).required().messages({
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters.",
    "any.required": "Username is required.",
  }),
});

export const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).optional(),
});

export const userPromptsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid("APPROVED", "DRAFT", "PENDING", "REJECTED", "ARCHIVED")
    .optional(),
});
