import express from "express";
import cors from "cors";
import helmet from "helmet";

import { healthRoutes } from "./modules/health/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/health", healthRoutes);
app.use(errorMiddleware);

export default app;