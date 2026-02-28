import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Zod validation middleware factory.
 * Validates req.body against the given schema.
 * On success, replaces req.body with parsed (coerced/transformed) data.
 * On failure, returns 400 with a structured errors array.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join(".") : "body",
        msg: issue.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    // Replace body with Zod-parsed data (trimmed, transformed values etc.)
    req.body = result.data;
    next();
  };
}
