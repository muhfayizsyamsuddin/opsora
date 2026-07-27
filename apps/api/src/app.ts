import express from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRoutes } from "./modules/health/index.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/health", healthRoutes);

export default app;