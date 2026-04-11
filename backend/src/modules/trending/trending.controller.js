import * as trendingService from "./trending.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { ApiError } from "../../shared/utils/ApiError.js";

export const getTrending = asyncHandler(async (req, res) => {
  const { window = "DAILY", limit = 20 } = req.query;

  const validWindows = ["DAILY", "WEEKLY", "MONTHLY"];
  if (!validWindows.includes(window.toUpperCase())) {
    throw ApiError.badRequest("Invalid window. Use: DAILY, WEEKLY, MONTHLY");
  }

  const data = await trendingService.getTrending(
    window.toUpperCase(),
    Math.min(parseInt(limit, 10) || 20, 50),
    req.user?.id,
  );

  ApiResponse.success(
    res,
    { prompts: data, window: window.toUpperCase() },
    "Trending prompts fetched.",
  );
});
