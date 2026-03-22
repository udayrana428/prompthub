import { ApiError } from "../shared/utils/ApiError.js";
import { MSG } from "../constants/messages.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    // Parse single FormData JSON payload
    if (req.body && typeof req.body.data === "string") {
      req.body = JSON.parse(req.body.data);
    }

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      // allowUnknown: property !== "params",
      allowUnknown: false,
      // convert: property === "params" || property === "query",
      convert: true,
    });

    if (error) {
      const formatted = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/"/g, ""),
      }));

      throw ApiError.badRequest(MSG.GENERIC.VALIDATION_ERROR, formatted);
    }

    req[property] = value;

    next();
  };
};
