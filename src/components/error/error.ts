// See https://stackoverflow.com/a/43595110 and https://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class APIError extends ExtendableError {
  public statusCode: number;
  public detail: any;
  public code: any;

  constructor(message: string, statusCode: number, detail: any, code: any) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
    this.code = code;
  }
}
