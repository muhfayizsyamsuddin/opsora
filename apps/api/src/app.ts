import express from "express";
import cors from "cors";
import helmet from "helmet";

import { healthRoutes } from "./modules/health/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRoutes } from "./modules/users/index.js";
import { authRoutes } from "./modules/auth/index.js";
import departmentRoutes from "./modules/departments/department.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import supplierRoutes from "./modules/suppliers/supplier.routes.js";
import purchaseRoutes from "./modules/purchases/purchase.routes.js";
import purchaseReturnRoutes from "./modules/purchase-returns/purchase-return.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import inventoryMovementRoutes from "./modules/inventory-movements/inventory-movement.routes.js";
import saleRoutes from "./modules/sales/sale.routes.js";
import saleReturnRoutes from "./modules/sales-returns/sale-return.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import roleRoutes from "./modules/roles/role.routes.js";
import permissionRoutes from "./modules/permissions/permission.routes.js";
import settingRoutes from "./modules/settings/setting.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import attendanceRoutes from "./modules/attendances/attendance.routes.js";
import leaveRoutes from "./modules/leaves/leave.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import payrollRoutes from "./modules/payroll/payroll.routes.js";
import performanceReviewRoutes from "./modules/performance-reviews/performance-review.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import { apiRateLimit } from "./middlewares/rate-limit.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

const allowedOrigins = [
  process.env.WEB_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
app.use("/health", healthRoutes);

app.use(`${API_PREFIX}`, apiRateLimit);

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/departments`, departmentRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/suppliers`, supplierRoutes);
app.use(`${API_PREFIX}/purchases`, purchaseRoutes);
app.use(`${API_PREFIX}/purchase-returns`, purchaseReturnRoutes);
app.use(`${API_PREFIX}/inventory/movements`, inventoryMovementRoutes);
app.use(`${API_PREFIX}/inventory-movements`, inventoryMovementRoutes);
app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
app.use(`${API_PREFIX}/sales`, saleRoutes);
app.use(`${API_PREFIX}/sale-returns`, saleReturnRoutes);
app.use(`${API_PREFIX}/customers`, customerRoutes);
app.use(`${API_PREFIX}/roles`, roleRoutes);
app.use(`${API_PREFIX}/permissions`, permissionRoutes);
app.use(`${API_PREFIX}/settings`, settingRoutes);
app.use(`${API_PREFIX}/employees`, employeeRoutes);
app.use(`${API_PREFIX}/attendances`, attendanceRoutes);
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/leave-requests`, leaveRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/payrolls`, payrollRoutes);
app.use(`${API_PREFIX}/performance-reviews`, performanceReviewRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

app.use(errorMiddleware);


export default app;