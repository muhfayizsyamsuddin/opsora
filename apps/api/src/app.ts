import express from "express";
import cors from "cors";
import helmet from "helmet";

import { healthRoutes } from "./modules/health/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRoutes } from "./modules/users/index.js";
import { authRoutes } from "./modules/auth/index.js";
import departmentRoutes from "./modules/departments/department.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import attendanceRoutes from "./modules/attendances/attendance.routes.js";
import leaveRoutes from "./modules/leaves/leave.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/attendances", attendanceRoutes);
app.use("/leaves", leaveRoutes);
app.use(errorMiddleware);

export default app;