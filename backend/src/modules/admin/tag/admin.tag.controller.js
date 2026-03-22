import * as service from "./admin.tag.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../../shared/utils/ApiResponse.js";
import { MSG } from "../../../constants/messages.js";

export const listTags = asyncHandler(async (req, res) => {
  const result = await service.listTags(req.query);
  ApiResponse.success(res, result, MSG.TAG.FETCHED);
});

export const createTag = asyncHandler(async (req, res) => {
  const tag = await service.createTag(req.body, req.user.id);
  ApiResponse.created(res, { tag }, MSG.TAG.CREATED);
});

export const approveTag = asyncHandler(async (req, res) => {
  const tag = await service.approveTag(req.params.id, req.user.id);
  ApiResponse.success(res, { tag }, "Tag approved successfully.");
});

export const rejectTag = asyncHandler(async (req, res) => {
  const tag = await service.rejectTag(req.params.id, req.user.id);
  ApiResponse.success(res, { tag }, "Tag rejected successfully.");
});

export const deleteTag = asyncHandler(async (req, res) => {
  await service.deleteTag(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.TAG.DELETED);
});
