import * as service from "./admin.category.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../../shared/utils/ApiResponse.js";
import { MSG } from "../../../constants/messages.js";

export const createCategory = asyncHandler(async (req, res) => {
  const category = await service.createCategory(req.body, req.user.id);
  ApiResponse.created(res, { category }, MSG.CATEGORY.CREATED);
});

export const listCategories = asyncHandler(async (req, res) => {
  const result = await service.listCategories(req.query);
  ApiResponse.success(res, result, MSG.CATEGORY.FETCHED);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await service.updateCategory(
    req.params.id,
    req.body,
    req.user.id,
  );
  ApiResponse.success(res, { category }, MSG.CATEGORY.UPDATED);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await service.deleteCategory(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.CATEGORY.DELETED);
});
