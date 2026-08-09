import { api } from "@/lib/api";

export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type Leave = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  employee: {
    id: string;
    name: string;
    email: string;
    department: {
      id: string;
      name: string;
    };
  };
};

export type GetLeavesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeaveStatus;
  employeeId?: string;
  sort?: "startDate" | "endDate" | "createdAt";
  order?: "asc" | "desc";
};

export type CreateLeavePayload = {
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type UpdateLeavePayload = {
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: LeaveStatus;
};

type LeavesResponse = {
  data: {
    data: Leave[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type LeaveResponse = {
  data: Leave;
};

export async function getLeaves(
  params: GetLeavesParams = {},
) {
  const response = await api.get<LeavesResponse>(
    "/leaves",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        status: params.status || undefined,
        employeeId:
          params.employeeId || undefined,
        sort: params.sort ?? "createdAt",
        order: params.order ?? "desc",
      },
    },
  );

  return response.data.data;
}

export async function getLeaveById(
  id: string,
) {
  const response = await api.get<LeaveResponse>(
    `/leaves/${id}`,
  );

  return response.data.data;
}

export async function createLeave(
  data: CreateLeavePayload,
) {
  const response = await api.post(
    "/leaves",
    data,
  );

  return response.data;
}

export async function updateLeave(
  id: string,
  data: UpdateLeavePayload,
) {
  const response = await api.patch(
    `/leaves/${id}`,
    data,
  );

  return response.data;
}

export async function approveLeave(
  id: string,
) {
  const response = await api.patch(
    `/leaves/${id}/approve`,
  );

  return response.data;
}

export async function rejectLeave(
  id: string,
) {
  const response = await api.patch(
    `/leaves/${id}/reject`,
  );

  return response.data;
}

export async function deleteLeave(
  id: string,
) {
  const response = await api.delete(
    `/leaves/${id}`,
  );

  return response.data;
}