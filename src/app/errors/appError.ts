// errors/AppError.ts
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public field?: string | undefined;

  constructor(statusCode: number, message: string, field?: string, stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.field = field;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
