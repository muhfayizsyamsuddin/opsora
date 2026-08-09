import { api } from "@/lib/api";

export type DashboardReport = {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  totalSalary: number;
  averageSalary: number;
  employeesByDepartment: {
    id: string;
    name: string;
    totalEmployees: number;
  }[];
};

export type AttendanceReport = {
  totalAttendances: number;
  present: number;
  late: number;
  absent: number;
  leave: number;
};

export type LeaveReport = {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
};

export type PayrollReport = {
  totalPayroll: number;
  averagePayroll: number;
  totalPayrollRecords: number;
  highestPayroll: {
    employee: string;
    totalSalary: number;
  } | null;
  lowestPayroll: {
    employee: string;
    totalSalary: number;
  } | null;
};

export type PerformanceReport = {
  averageScore: number;
  totalReviews: number;
  highestScore: {
    employee: string;
    score: number;
  } | null;
  lowestScore: {
    employee: string;
    score: number;
  } | null;
};

export async function getDashboardReport() {
  const response = await api.get("/reports/dashboard");

  return response.data.data as DashboardReport;
}

export async function getAttendanceReport() {
  const response = await api.get("/reports/attendance");

  return response.data.data as AttendanceReport;
}

export async function getLeaveReport() {
  const response = await api.get("/reports/leaves");

  return response.data.data as LeaveReport;
}

export async function getPayrollReport() {
  const response = await api.get("/reports/payroll");

  return response.data.data as PayrollReport;
}

export async function getPerformanceReport() {
  const response = await api.get("/reports/performance");

  return response.data.data as PerformanceReport;
}