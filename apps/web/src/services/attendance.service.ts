import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  Attendance,
  AttendanceListResponse,
  AttendanceQueryParams,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "@/features/attendances/types/attendance";

export async function getAttendances(
  params?: AttendanceQueryParams,
): Promise<AttendanceListResponse> {
  const response =
    await api.get<ApiResponse<AttendanceListResponse>>(
      API.ATTENDANCES,
      { params },
    );

  return response.data.data;
}

export async function getAttendanceById(
  id: string,
): Promise<Attendance> {
  const response =
    await api.get<ApiResponse<Attendance>>(
      `${API.ATTENDANCES}/${id}`,
    );

  return response.data.data;
}

export async function getEmployeeAttendance(
  employeeId: string,
  params?: Omit<
    AttendanceQueryParams,
    "employee_id" | "date" | "search"
  >,
): Promise<AttendanceListResponse> {
  const response =
    await api.get<ApiResponse<AttendanceListResponse>>(
      `${API.ATTENDANCES}/employee/${employeeId}`,
      { params },
    );

  return response.data.data;
}

export async function createAttendance(
  data: CreateAttendanceInput,
): Promise<Attendance> {
  const response =
    await api.post<ApiResponse<Attendance>>(
      API.ATTENDANCES,
      data,
    );

  return response.data.data;
}

export async function updateAttendance(
  id: string,
  data: UpdateAttendanceInput,
): Promise<Attendance> {
  const response =
    await api.patch<ApiResponse<Attendance>>(
      `${API.ATTENDANCES}/${id}`,
      data,
    );

  return response.data.data;
}