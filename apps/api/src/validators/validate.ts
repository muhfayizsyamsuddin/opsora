import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export function validate<T extends ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(result.error);
    }

    const data = result.data as {
      body: Request["body"];
      query: Request["query"];
      params: Request["params"];
    };

    req.body = data.body;

    next();
  };
}