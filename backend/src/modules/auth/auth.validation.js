import Joi from "joi";
import { PASSWORD } from "../../constants/index.js";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required().messages({
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters.",
    "any.required": "Username is required.",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .min(PASSWORD.MIN_LENGTH)
    .max(PASSWORD.MAX_LENGTH)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": `Password must be at least ${PASSWORD.MIN_LENGTH} characters.`,
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and a number.",
      "any.required": "Password is required.",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required.",
  }),
  newPassword: Joi.string()
    .min(PASSWORD.MIN_LENGTH)
    .max(PASSWORD.MAX_LENGTH)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .disallow(Joi.ref("currentPassword"))
    .required()
    .messages({
      "any.invalid": "New password must be different from current password.",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and a number.",
    }),
});
