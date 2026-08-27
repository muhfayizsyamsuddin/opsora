export type DashboardReport = {
  totalEmployees: number;
  totalDepartments: number;

  presentToday: number;
  lateToday: number;
  absentToday: number;

  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;

  totalSalary: string | number;
  averageSalary: string | number;

  employeesByDepartment: {
    id: string;
    name: string;
    totalEmployees: number;
  }[];

  attendanceWeekly: {
    day: string;
    date: string;
    attendance: number;
  }[];

  recentActivities: {
    id: string;
    type:
      | "EMPLOYEE"
      | "ATTENDANCE"
      | "LEAVE"
      | "PAYROLL"
      | "PERFORMANCE";
    title: string;
    description: string;
    createdAt: string;
  }[];

  upcomingLeaves: {
    id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
  }[];
};

export type SalesReport = {
  totalSales: number;
  completedSales: number;
  cancelledSales: number;
  totalRevenue: string | number;
};

export type PurchasesReport = {
  totalPurchases: number;
  completedPurchases: number;
  draftPurchases: number;
  cancelledPurchases: number;
  totalPurchaseAmount: string | number;
};

export type InventoryReport = {
  totalProducts: number;
  totalActiveProducts: number;
  totalStockQuantity: string | number;
  lowStockCount: number;
  totalStockIn: string | number;
  totalStockOut: string | number;
};

export type ProfitReport = {
  revenue: string | number;
  purchaseCost: string | number;
  profit: string | number;
};

export type PerformanceReport = {
  averageScore: string | number;
  totalReviews: number;

  highestScore: {
    employee: string;
    score: string | number;
  } | null;

  lowestScore: {
    employee: string;
    score: string | number;
  } | null;
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
  totalPayroll: string | number;
  averagePayroll: string | number;
  totalPayrollRecords: number;

  highestPayroll: {
    employee: string;
    totalSalary: string | number;
  } | null;

  lowestPayroll: {
    employee: string;
    totalSalary: string | number;
  } | null;
};