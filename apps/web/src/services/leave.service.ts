import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  Leave,
  LeaveListResponse,
  LeaveQueryParams,
  CreateLeaveInput,
  UpdateLeaveInput,
} from "@/features/leaves/types/leave";

export async function getLeaves(
  params?: LeaveQueryParams,
): Promise<LeaveListResponse> {
  const response =
    await api.get<
      ApiResponse<LeaveListResponse>
    >(API.LEAVE_REQUESTS, {
      params,
    });

  return response.data.data;
}

export async function getLeaveById(
  id: string,
): Promise<Leave> {
  const response =
    await api.get<ApiResponse<Leave>>(
      `${API.LEAVE_REQUESTS}/${id}`,
    );

  return response.data.data;
}

export async function createLeave(
  data: CreateLeaveInput,
): Promise<Leave> {
  const response =
    await api.post<ApiResponse<Leave>>(
      API.LEAVE_REQUESTS,
      data,
    );

  return response.data.data;
}

export async function updateLeave(
  id: string,
  data: UpdateLeaveInput,
): Promise<Leave> {
  const response =
    await api.put<ApiResponse<Leave>>(
      `${API.LEAVE_REQUESTS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function approveLeave(
  id: string,
): Promise<Leave> {
  const response =
    await api.post<ApiResponse<Leave>>(
      `${API.LEAVE_REQUESTS}/${id}/approve`,
    );

  return response.data.data;
}

export async function rejectLeave(
  id: string,
): Promise<Leave> {
  const response =
    await api.post<ApiResponse<Leave>>(
      `${API.LEAVE_REQUESTS}/${id}/reject`,
    );

  return response.data.data;
}

export async function cancelLeave(
  id: string,
): Promise<Leave> {
  const response =
    await api.post<ApiResponse<Leave>>(
      `${API.LEAVE_REQUESTS}/${id}/cancel`,
    );

  return response.data.data;
}