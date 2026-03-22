import * as notifService from "./notification.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notifService.getUserNotifications(
    req.user.id,
    req.query,
  );
  ApiResponse.success(res, result, MSG.NOTIFICATION.LIST_FETCHED);
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notifService.markAllRead(req.user.id);
  ApiResponse.success(res, null, MSG.NOTIFICATION.MARKED_READ);
});

export const markOneRead = asyncHandler(async (req, res) => {
  await notifService.markOneRead(req.params.id, req.user.id);
  ApiResponse.success(res, null, MSG.NOTIFICATION.MARKED_READ);
});
