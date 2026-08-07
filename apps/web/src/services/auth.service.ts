import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type {
  LoginRequest,
  LoginResponse,
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