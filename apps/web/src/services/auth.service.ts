import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
} from "@/features/auth/types/auth";

import type { ApiResponse } from "@/types/api";

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response =
    await api.post<ApiResponse<LoginResponse>>(
      API.AUTH.LOGIN,
      data,
    );

  return response.data.data;
}

export async function refresh(
  refresh_token: string,
): Promise<RefreshResponse> {
  const response =
    await api.post<ApiResponse<RefreshResponse>>(
      API.AUTH.REFRESH,
      { refresh_token },
    );

  return response.data.data;
}

export async function me(): Promise<User> {
  const response =
    await api.get<ApiResponse<User>>(
      API.AUTH.ME,
    );

  return response.data.data;
}

export async function logout(
  refresh_token: string,
): Promise<void> {
  await api.post(
    API.AUTH.LOGOUT,
    { refresh_token },
  );
}