export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "LEAVE";

export type AttendanceEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  salary: string | number;
  hireDate: string;
  status: "ACTIVE" | "INACTIVE";
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type Attendance = {
  id: string;
  employeeId: string;
  checkIn: string;
  checkOut: string | null;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  employee: AttendanceEmployee;
};

export type AttendanceQueryParams = {
  page?: number;
  per_page?: number;
  date?: string;
  search?: string;
  employee_id?: string;
  status?: AttendanceStatus;
  sort_by?: "checkIn" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type AttendanceListResponse = {
  data: Attendance[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type CreateAttendanceInput = {
  employeeId: string;
  checkIn: string;
  checkOut?: string;
  status?: AttendanceStatus;
};

export type UpdateAttendanceInput = {
  checkOut?: string;
  status?: AttendanceStatus;
};