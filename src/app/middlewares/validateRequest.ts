import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && req.body.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid JSON format in request body",
          });
        }
      }

      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;

      next();
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          errors: error.issues.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(error);
    }
  };
};