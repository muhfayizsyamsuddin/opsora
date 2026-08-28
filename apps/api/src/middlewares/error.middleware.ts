import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ZodError } from "zod";
import multer from "multer";
import jwt from "jsonwebtoken";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "File size must not exceed 5 MB.",
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        code: "UPLOAD_ERROR",
        message: err.message,
      },
    });
  }

  if (
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.NotBeforeError
  ) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
  });
}