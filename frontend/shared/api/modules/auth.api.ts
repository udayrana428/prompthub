import apiClient from "../client";
import type { ApiResponse } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  username: string;
}

export const login = async (
  payload: LoginPayload,
): Promise<
  ApiResponse<{
    user: unknown;
    accessToken: string;
  }>
> => apiClient.post("/auth/login", payload);

export const register = async (
  payload: RegisterPayload,
): Promise<ApiResponse<{ user: unknown }>> =>
  apiClient.post("/auth/register", payload);

export const refresh = async (): Promise<ApiResponse<{ accessToken: string }>> =>
  apiClient.post("/auth/refresh");

export const me = async (): Promise<ApiResponse<{ user: unknown }>> =>
  apiClient.get("/auth/me");

export const logout = async (): Promise<ApiResponse<null>> =>
  apiClient.post("/auth/logout");
