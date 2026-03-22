import * as tagService from "./tag.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const listTags = asyncHandler(async (req, res) => {
  const result = await tagService.listTags(req.query);
  ApiResponse.success(res, result, MSG.TAG.FETCHED);
});

export const getTagBySlug = asyncHandler(async (req, res) => {
  const tag = await tagService.getTagBySlug(req.params.slug);
  ApiResponse.success(res, { tag }, MSG.TAG.FETCHED);
});

export const getTagPrompts = asyncHandler(async (req, res) => {
  const result = await tagService.getTagPrompts(req.params.slug, req.query);
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});
