import * as service from "./admin.prompt.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../../shared/utils/ApiResponse.js";
import { MSG } from "../../../constants/messages.js";

export const listPrompts = asyncHandler(async (req, res) => {
  const result = await service.listPrompts(req.query);
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});

export const getPrompt = asyncHandler(async (req, res) => {
  const prompt = await service.getPromptById(req.params.id);
  ApiResponse.success(res, { prompt }, MSG.PROMPT.FETCHED);
});

export const createPrompt = asyncHandler(async (req, res) => {
  const prompt = await service.createPrompt(req.body, req.user.id, req.file);
  ApiResponse.created(res, { prompt }, MSG.PROMPT.CREATED);
});

export const updatePrompt = asyncHandler(async (req, res) => {
  const prompt = await service.updatePrompt(
    req.params.id,
    req.body,
    req.user.id,
    req.file,
  );
  ApiResponse.success(res, { prompt }, MSG.PROMPT.UPDATED);
});

export const updatePromptStatus = asyncHandler(async (req, res) => {
  const prompt = await service.updatePromptStatus(
    req.params.id,
    req.body,
    req.user.id,
  );
  ApiResponse.success(res, { prompt }, MSG.PROMPT.UPDATED);
});

export const updatePromptFeatured = asyncHandler(async (req, res) => {
  const prompt = await service.updatePromptFeatured(
    req.params.id,
    req.body.featured,
    req.user.id,
  );
  ApiResponse.success(res, { prompt }, MSG.PROMPT.UPDATED);
});

export const deletePrompt = asyncHandler(async (req, res) => {
  await service.deletePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.DELETED);
});
