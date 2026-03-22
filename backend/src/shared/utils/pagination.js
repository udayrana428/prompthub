import { PAGINATION } from "../../constants/index.js";

/**
 * Parses pagination params from query string
 */
export const getPaginationParams = (query) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Builds a standard paginated response envelope
 */
export const buildPaginatedResponse = (data, total, page, limit, meta = {}) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    meta: meta,
  };
};
