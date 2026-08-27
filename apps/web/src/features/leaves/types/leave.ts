export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type LeaveEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
  departmentId: string;
  department: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type LeaveReviewer = {
  id: string;
  name: string;
  email: string;
};

export type Leave = {
  id: string;
  employeeId: string;
  reviewerId: string | null;

  startDate: string;
  endDate: string;

  reason: string;
  status: LeaveStatus;

  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;

  employee: LeaveEmployee;

  reviewer: LeaveReviewer | null;
};

export type LeaveQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  employee_id?: string;
  status?: LeaveStatus;
  start_date?: string;
  end_date?: string;
  sort_by?:
    | "startDate"
    | "endDate"
    | "createdAt";
  sort_order?: "asc" | "desc";
};

export type LeaveListResponse = {
  data: Leave[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type CreateLeaveInput = {
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type UpdateLeaveInput = {
  startDate?: string;
  endDate?: string;
  reason?: string;
};

export type LeaveEmployeeOption = {
  id: string;
  employeeCode: string;
  name: string;
};