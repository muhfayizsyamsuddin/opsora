"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getPerformanceReport,
} from "@/services/report.service";

export function usePeopleReports() {
  const attendance = useQuery({
    queryKey: ["reports", "attendance"],
    queryFn: getAttendanceReport,
  });

  const leave = useQuery({
    queryKey: ["reports", "leave"],
    queryFn: getLeaveReport,
  });

  const payroll = useQuery({
    queryKey: ["reports", "payroll"],
    queryFn: getPayrollReport,
  });

  const performance = useQuery({
    queryKey: ["reports", "performance"],
    queryFn: getPerformanceReport,
  });

  return {
    attendance,
    leave,
    payroll,
    performance,
    isLoading:
      attendance.isLoading ||
      leave.isLoading ||
      payroll.isLoading ||
      performance.isLoading,
    hasError:
      !!attendance.error ||
      !!leave.error ||
      !!payroll.error ||
      !!performance.error,
  };
}