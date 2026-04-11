import * as authService from "./auth.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";
import { appConfig } from "../../config/app.config.js";
import requestIp from "request-ip";

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...appConfig.cookie,
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshToken", refreshToken, {
    ...appConfig.cookie,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearTokenCookies = (res) => {
  res.clearCookie("accessToken", appConfig.cookie);
  res.clearCookie("refreshToken", appConfig.cookie);
};

export const register = asyncHandler(async (req, res) => {
  const ip = requestIp.getClientIp(req);
  const userAgent = req.headers["user-agent"];

  const { accessToken, refreshToken, user } = await authService.register(
    req.body,
    { ip, userAgent },
  );

  setTokenCookies(res, accessToken, refreshToken);
  ApiResponse.created(
    res,
    { user, accessToken },
    MSG.AUTH.REGISTER_SUCCESS,
  );
});

export const login = asyncHandler(async (req, res) => {
  const ip = requestIp.getClientIp(req);
  const userAgent = req.headers["user-agent"];

  const { accessToken, refreshToken, user } = await authService.login(
    req.body,
    { ip, userAgent },
  );

  setTokenCookies(res, accessToken, refreshToken);

  ApiResponse.success(res, { user, accessToken }, MSG.AUTH.LOGIN_SUCCESS);
});

export const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(rawRefreshToken, req.user.id);
  clearTokenCookies(res);
  ApiResponse.success(res, null, MSG.AUTH.LOGOUT_SUCCESS);
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);
  clearTokenCookies(res);
  ApiResponse.success(res, null, "Logged out from all devices.");
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!rawRefreshToken) {
    throw new (await import("../../shared/utils/ApiError.js")).ApiError(
      401,
      "Refresh token is required.",
    );
  }

  const { accessToken, refreshToken } =
    await authService.refreshTokens(rawRefreshToken);
  setTokenCookies(res, accessToken, refreshToken);
  ApiResponse.success(res, { accessToken }, MSG.AUTH.TOKEN_REFRESHED);
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  clearTokenCookies(res);
  ApiResponse.success(res, null, MSG.AUTH.PASSWORD_CHANGED);
});

export const me = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id,
    username: req.user.username,
    slug: req.user.slug,
    email: req.user.email,
    status: req.user.status,
    createdOn: req.user.createdOn,
    roles: req.user.roles ?? [],
    permissions: Array.from(req.user.permissions ?? []),
    profile: req.user.profile ?? null,
  };

  ApiResponse.success(res, { user }, MSG.USER.FETCHED);
});
