import { api } from "@/lib/api";

export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "LEAVE";

export type AttendanceEmployee = {
  id: string;
  name: string;
  email: string;
  department: {
    id: string;
    name: string;
  };
};

export type Attendance = {
  id: string;
  employeeId: string;
  checkIn: string;
  checkOut: string | null;
  status: AttendanceStatus;
  employee: AttendanceEmployee;
};

export type GetAttendancesParams = {
  page?: number;
  limit?: number;
  search?: string;
  employeeId?: string;
  status?: AttendanceStatus;
  sort?: "checkIn" | "createdAt";
  order?: "asc" | "desc";
};

type AttendancesResponse = {
  data: {
    data: Attendance[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type AttendanceResponse = {
  data: Attendance;
};

export type CreateAttendancePayload = {
  employeeId: string;
  checkIn: string;
  checkOut?: string;
  status?: AttendanceStatus;
};

export type UpdateAttendancePayload = {
  checkOut?: string;
  status?: AttendanceStatus;
};

export async function getAttendances(
  params: GetAttendancesParams = {},
) {
  const response =
    await api.get<AttendancesResponse>(
      "/attendances",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search:
            params.search || undefined,
          employeeId:
            params.employeeId || undefined,
          status:
            params.status || undefined,
          sort:
            params.sort ?? "createdAt",
          order:
            params.order ?? "desc",
        },
      },
    );

  return response.data.data;
}

export async function getAttendanceById(
  id: string,
) {
  const response =
    await api.get<AttendanceResponse>(
      `/attendances/${id}`,
    );

  return response.data.data;
}

export async function createAttendance(
  data: CreateAttendancePayload,
) {
  const response = await api.post(
    "/attendances",
    data,
  );

  return response.data;
}

export async function updateAttendance(
  id: string,
  data: UpdateAttendancePayload,
) {
  const response = await api.patch(
    `/attendances/${id}`,
    data,
  );

  return response.data;
}

export async function deleteAttendance(
  id: string,
) {
  const response = await api.delete(
    `/attendances/${id}`,
  );

  return response.data;
}