export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  USERS: "/users",
  PERMISSIONS: "/permissions",
  ROLES: "/roles",
  SETTINGS: "/settings",

  DASHBOARD: "/dashboard",
  CATEGORIES: "/categories",
  PRODUCTS: "/products",
  SUPPLIERS: "/suppliers",
  CUSTOMERS: "/customers",
  PURCHASES: "/purchases",
  PURCHASE_RETURNS: "/purchase-returns",
  SALE_RETURNS: "/sale-returns",
  SALES: "/sales",
  INVENTORY: "/inventory",
  REPORTS: "/reports",

  EMPLOYEES: "/employees",
  DEPARTMENTS: "/departments",
  ATTENDANCES: "/attendances",
  LEAVE_REQUESTS: "/leave-requests",
  PERFORMANCE_REVIEWS: "/performance-reviews",
  PAYROLLS: "/payrolls",
} as const;