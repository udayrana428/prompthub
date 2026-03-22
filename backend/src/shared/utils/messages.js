// utils/messages.js

const deepMerge = (target, source) => {
  //Do objects ko jodta hai, lekin shallow nahi — andar ke nested objects ko bhi merge karta hai.
  if (!source) return target;

  Object.keys(source).forEach((key) => {
    if (
      typeof target[key] === "object" &&
      typeof source[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });

  return target;
};

const format = (
  template,
  vars = {}, //Text me placeholders ko object ki values se replace karta hai.
) => template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

const entityMessages = ({ singular, plural, overrides = {} }) => {
  if (!singular) throw new Error("entityMessages: 'singular' is required");
  if (!plural) plural = singular + "s"; // fallback safe default

  const base = {
    // message templates for all entities
    CRUD: {
      CREATE_SUCCESS: `${singular} created successfully`,
      FAILED_TO_CREATE: `Failed to create ${singular}`,

      UPDATE_SUCCESS: `${singular} updated successfully`,
      NO_CHANGES: `No changes detected for ${singular}`,
      FAILED_TO_UPDATE: `Failed to update ${singular}`,

      DELETE_SUCCESS: `${singular} deleted successfully`,
      FAILED_TO_DELETE: `Failed to delete ${singular}`,

      RESTORE_SUCCESS: `${singular} restored successfully`,
      SOFT_DELETE_SUCCESS: `${singular} archived successfully`,
      HARD_DELETE_SUCCESS: `${singular} permanently deleted`,
      ALREADY_ACTIVE: `${singular} is already active`,
      FAILED_TO_RESTORE: `Failed to restore ${singular}`,
      FAILED_TO_ARCHIVE: `Failed to archive ${singular}`,
      FAILED_TO_PERMANENTLY_DELETE: `Failed to permanently delete ${singular}`,

      FETCH_SUCCESS: `${plural} fetched successfully`,
      FETCH_SUCCESS_SINGLE: `${singular} fetched successfully`,
      NOT_FOUND: `${singular} not found`,
      DUPLICATE: `${singular} already exists`,
      CONFLICT: `${singular} has conflicting state`,

      STATUS_CHANGED: `${singular} status changed successfully`,
      ALREADY_IN_STATUS: `${singular} is already in the same status`,
      FAILED_TO_CHANGE_STATUS: `Failed to change ${singular} status`,
      NO_DATA_FOUND: `No ${plural.toLowerCase()} found`,
    },

    VALIDATION: {
      INVALID_ID: `Invalid ${singular.toLowerCase()} ID`,
      REQUIRED_FIELDS: `${singular} requires mandatory fields`,
      EMPTY_FIELDS: `${singular} cannot have empty fields`,
      INVALID_PAYLOAD: `Invalid ${singular.toLowerCase()} data`,
      UPDATE_REQUIRED_FIELDS: `${singular} update requires mandatory fields`,
      INVALID_DYNAMIC_FIELD: `Invalid dynamic field`,
    },

    BUSINESS: {
      CANNOT_DELETE: `${singular} cannot be deleted due to linked records`,
      CANNOT_UPDATE: `${singular} cannot be updated due to business rules`,
      OPERATION_NOT_ALLOWED: `Operation not allowed for this ${singular.toLowerCase()}`,
    },

    AUTH: {
      NOT_AUTHORIZED: `You are not authorized to access this ${singular.toLowerCase()}`,
      FORBIDDEN_ACTION: `Forbidden action on ${singular.toLowerCase()}`,
    },

    SYSTEM: {
      SERVER_ERROR: `Something went wrong. Please try again later`,
      DB_ERROR: `Database error occurred`,
      TRANSACTION_FAILED: `Database transaction failed`,
      SERVICE_UNAVAILABLE: `Required service unavailable`,
      INTEGRATION_FAILED: `Failed to communicate with an external service`,
      TIMEOUT: `Operation timed out`,
      DATA_INCONSISTENCY: `Data mismatch detected`,
      RETRY_LATER: `Temporary error, retry later`,
    },

    FILE: {
      REQUIRED: `${singular} requires a file upload`,
      IMAGE_REQUIRED: `Image is required for ${singular}`,
      INVALID_TYPE: `Invalid file type provided for ${singular}`,
      INVALID_FILE: `Invalid file uploaded for ${singular}`,
      UPLOAD_FAILED: `Failed to upload file for ${singular}`,
      DELETE_FAILED: `Failed to delete file for ${singular}`,
      SIZE_TOO_LARGE: `Uploaded file exceeds the allowed size`,
    },

    CLOUD: {
      UPLOAD_FAILED: (fileType) => `${fileType} upload failed`,
      RETRY_FAILED: (fileType) => `${fileType} upload failed after retries`,
      DELETE_FAILED: (fileType) => `Failed to delete ${fileType} from cloud`,
      INVALID_RESPONSE: (fileType) =>
        `Cloud returned an invalid response for ${fileType}`,
    },

    CUSTOM: (msg, vars = {}) => format(msg, vars),
  };

  return deepMerge(base, overrides);
};

export { entityMessages };
