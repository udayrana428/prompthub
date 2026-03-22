import * as promptService from "./prompt.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";
import { hashToken } from "../../shared/services/crypto.service.js";
import requestIp from "request-ip";

export const listPrompts = asyncHandler(async (req, res) => {
  const result = await promptService.listPrompts(req.query, req.user?.id);
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});

export const getPromptBySlug = asyncHandler(async (req, res) => {
  const ip = requestIp.getClientIp(req);
  const prompt = await promptService.getPromptBySlug(req.params.slug, {
    userId: req.user?.id,
    sessionId: req.cookies?.sessionId,
    ipHash: ip ? hashToken(ip) : null,
    userAgent: req.headers["user-agent"],
  });
  ApiResponse.success(res, prompt, MSG.PROMPT.FETCHED);
});

export const getPromptForEdit = asyncHandler(async (req, res) => {
  const prompt = await promptService.getPromptForEdit(
    req.params.id,
    req.user.id,
  );
  ApiResponse.success(res, { prompt }, MSG.PROMPT.FETCHED);
});

export const createPrompt = asyncHandler(async (req, res) => {
  const prompt = await promptService.createPrompt(
    req.body,
    req.user.id,
    req.file,
  );
  ApiResponse.created(res, { prompt }, MSG.PROMPT.CREATED);
});

export const updatePrompt = asyncHandler(async (req, res) => {
  const prompt = await promptService.updatePrompt(
    req.params.id,
    req.user.id,
    req.body,
    req.file,
  );
  ApiResponse.success(res, { prompt }, MSG.PROMPT.UPDATED);
});

export const deletePrompt = asyncHandler(async (req, res) => {
  await promptService.deletePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.DELETED);
});

export const likePrompt = asyncHandler(async (req, res) => {
  await promptService.likePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.LIKED);
});

export const unlikePrompt = asyncHandler(async (req, res) => {
  await promptService.unlikePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.UNLIKED);
});

export const favoritePrompt = asyncHandler(async (req, res) => {
  await promptService.favoritePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.FAVORITED);
});

export const unfavoritePrompt = asyncHandler(async (req, res) => {
  await promptService.unfavoritePrompt(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.PROMPT.UNFAVORITED);
});

export const copyPrompt = asyncHandler(async (req, res) => {
  const result = await promptService.copyPrompt(req.params.id);
  ApiResponse.success(res, result, "Prompt text copied.");
});
