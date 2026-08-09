import { api } from "@/lib/api";

export type Payroll = {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  createdAt: string;
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

export type GetPayrollsParams = {
  page?: number;
  limit?: number;
  employeeId?: string;
  month?: number;
  year?: number;
  search?: string;
  sort?:
    | "month"
    | "year"
    | "baseSalary"
    | "bonus"
    | "deduction"
    | "totalSalary"
    | "createdAt";
  order?: "asc" | "desc";
};

type PayrollsResponse = {
  data: Payroll[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getPayrolls(
  params: GetPayrollsParams = {},
) {
  const response = await api.get("/payrolls", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      employeeId:
        params.employeeId || undefined,
      month: params.month ?? undefined,
      year: params.year ?? undefined,
      search:
        params.search || undefined,
      sort:
        params.sort ?? "createdAt",
      order:
        params.order ?? "desc",
    },
  });

  return response.data.data as PayrollsResponse;
}

export async function getPayrollById(
  id: string,
) {
  const response = await api.get(
    `/payrolls/${id}`,
  );

  return response.data.data as Payroll;
}

export type CreatePayrollPayload = {
  employeeId: string;
  month: number;
  year: number;
  bonus: number;
  deduction: number;
};

export async function createPayroll(
  data: CreatePayrollPayload,
) {
  const response = await api.post(
    "/payrolls",
    data,
  );

  return response.data.data as Payroll;
}

export async function deletePayroll(
  id: string,
) {
  const response = await api.delete(
    `/payrolls/${id}`,
  );

  return response.data;
}