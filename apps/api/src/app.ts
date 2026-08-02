import express from "express";
import cors from "cors";
import helmet from "helmet";

import { healthRoutes } from "./modules/health/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRoutes } from "./modules/users/index.js";
import { authRoutes } from "./modules/auth/index.js";
import departmentRoutes from "./modules/departments/department.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/health", healthRoutes);
app.use("/departments", departmentRoutes);
app.use(errorMiddleware);

export default app;