import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Opsora API is running",
  });
});

export default app;