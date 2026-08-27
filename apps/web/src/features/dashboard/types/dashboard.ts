export interface DashboardSummary {
  sales: {
    totalCount: number;
    totalAmount: number;
  };

  purchases: {
    totalCount: number;
    totalAmount: number;
  };

  inventory: {
    totalProducts: number;
    totalActiveProducts: number;
    totalStockQuantity: number;
  };
}

export interface RecentTransactionParty {
  id: string;
  name: string;
}

export interface RecentTransaction {
  id: string;
  type: "SALE" | "PURCHASE";
  date: string;
  amount: number;
  status: string;
  party: RecentTransactionParty | null;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minimumStock: number;
}

export interface DepartmentEmployeeCount {
  id: string;
  name: string;
  totalEmployees: number;
}

export interface PeopleSummary {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  employeesByDepartment: DepartmentEmployeeCount[];
}