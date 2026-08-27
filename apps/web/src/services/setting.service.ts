import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  Settings,
  UpdateSettingsInput,
} from "@/features/settings/types/setting";

export async function getSettings(): Promise<Settings> {
  const response =
    await api.get<ApiResponse<Settings>>(
      API.SETTINGS,
    );

  return response.data.data;
}

export async function updateSettings(
  data: UpdateSettingsInput,
): Promise<Settings> {
  const response =
    await api.patch<ApiResponse<Settings>>(
      API.SETTINGS,
      data,
    );

  return response.data.data;
}