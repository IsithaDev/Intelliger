type Code = "ERROR" | "SENDING_EMAIL_ERROR" | "EMAIL_NOT_VERIFIED";

class AppError extends Error {
  statusCode: number;
  status: string;
  code?: Code;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code?: Code) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
