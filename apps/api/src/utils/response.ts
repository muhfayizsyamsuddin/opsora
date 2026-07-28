import { Response } from "express";

export function success<T>(
  res: Response,
  data: T,
  message = "Success",
) {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}

export function created<T>(
  res: Response,
  data: T,
  message = "Created",
) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function noContent(res: Response) {
  return res.status(204).send();
}