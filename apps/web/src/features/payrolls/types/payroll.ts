export type PayrollEmployeeDepartment = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PayrollEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  salary: number | string;
  hireDate: string;
  status: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: PayrollEmployeeDepartment;
};

export type Payroll = {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number | string;
  bonus: number | string;
  deduction: number | string;
  totalSalary: number | string;
  createdAt: string;
  updatedAt: string;
  employee: PayrollEmployee;
};

export type PayrollListResponse = {
  data: Payroll[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PayrollQueryParams = {
  page?: number;
  per_page?: number;
  employee_id?: string;
  month?: number;
  year?: number;
  search?: string;
  sort_by?:
    | "month"
    | "year"
    | "baseSalary"
    | "bonus"
    | "deduction"
    | "totalSalary"
    | "createdAt";
  sort_order?: "asc" | "desc";
};

export type CreatePayrollInput = {
  employeeId: string;
  month: number;
  year: number;
  bonus: number;
  deduction: number;
};