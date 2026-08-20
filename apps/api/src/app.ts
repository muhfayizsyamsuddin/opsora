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
import inventoryMovementRoutes from "./modules/inventory-movements/inventory-movement.routes.js";
import saleRoutes from "./modules/sales/sale.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import roleRoutes from "./modules/roles/role.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import attendanceRoutes from "./modules/attendances/attendance.routes.js";
import leaveRoutes from "./modules/leaves/leave.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import payrollRoutes from "./modules/payroll/payroll.routes.js";
import performanceReviewRoutes from "./modules/performance-reviews/performance-review.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);
app.use("/departments", departmentRoutes);
app.use("/categories", categoryRoutes);
app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/inventory-movements", inventoryMovementRoutes);
app.use("/sales", saleRoutes);
app.use("/roles", roleRoutes);
app.use("/customers", customerRoutes);
app.use("/employees", employeeRoutes);
app.use("/attendances", attendanceRoutes);
app.use("/leaves", leaveRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/payrolls", payrollRoutes);
app.use("/performance-reviews", performanceReviewRoutes);
app.use("/reports", reportRoutes);
app.use(errorMiddleware);


export default app;