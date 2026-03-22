import * as categoryService from "./category.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(req.query);
  ApiResponse.success(res, result, MSG.CATEGORY.FETCHED);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  ApiResponse.success(res, { category }, MSG.CATEGORY.FETCHED);
});

export const getCategoryPrompts = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategoryPrompts(
    req.params.slug,
    req.query,
  );
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});
