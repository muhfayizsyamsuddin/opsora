export type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE";

export type EmployeeDepartment = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  salary: string | number;
  hireDate: string;
  status: EmployeeStatus;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: EmployeeDepartment;
};

export type EmployeeQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  department_id?: string;
  status?: EmployeeStatus;
  sort_by?:
    | "name"
    | "salary"
    | "hireDate"
    | "createdAt";
  sort_order?: "asc" | "desc";
};

export type EmployeeListResponse = {
  data: Employee[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type CreateEmployeeInput = {
  name: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  departmentId: string;
};

export type UpdateEmployeeInput = {
  name?: string;
  email?: string;
  position?: string;
  salary?: number;
  hireDate?: string;
  departmentId?: string;
  status?: EmployeeStatus;
};