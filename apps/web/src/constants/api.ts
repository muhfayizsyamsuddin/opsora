export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  DASHBOARD: "/dashboard",
  CATEGORIES: "/categories",
  PRODUCTS: "/products",
  SUPPLIERS: "/suppliers",
  CUSTOMERS: "/customers",
  PURCHASES: "/purchases",
  SALES: "/sales",
  INVENTORY: "/inventory",
  REPORTS: "/reports",

  EMPLOYEES: "/employees",
  DEPARTMENTS: "/departments",
  ATTENDANCE: "/attendance",
  LEAVE_REQUESTS: "/leave-requests",
  PERFORMANCE_REVIEWS: "/performance-reviews",
} as const;