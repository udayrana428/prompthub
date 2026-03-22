import Joi from "joi";

export const assignUserRolesSchema = Joi.object({
  roleIds: Joi.array()
    .items(Joi.string().uuid())
    .min(0)
    .required()
    .messages({ "any.required": "roleIds array is required." }),
});
