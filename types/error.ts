import { StatusCodes } from 'http-status-codes';

export type ErrorResponse = {
  readonly statusCode: number;
  readonly message: string;
  readonly errors?: Record<string, string>;
};

export class HttpError extends Error {
  readonly name = 'HttpError';
  code: string;
  status: number;
  errors?: ErrorResponse['errors'];

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);

    this.status = error.statusCode;
    switch (error.statusCode) {
      case StatusCodes.UNAUTHORIZED:
        this.code = 'UNAUTHORIZED';
        break;

      case StatusCodes.FORBIDDEN:
        this.code = 'FORBIDDEN';
        break;

      case StatusCodes.NOT_FOUND:
        this.code = 'NOT_FOUND';
        break;

      case StatusCodes.METHOD_NOT_ALLOWED:
        this.code = 'METHOD_NOT_ALLOWED';
        break;

      case StatusCodes.CONFLICT:
        this.code = 'CONFLICT';
        break;

      case StatusCodes.UNPROCESSABLE_ENTITY:
        this.code = 'UNPROCESSABLE_ENTITY';
        this.errors = error.errors;
        break;

      case StatusCodes.INTERNAL_SERVER_ERROR:
        this.code = 'INTERNAL_SERVER_ERROR';
        break;

      case StatusCodes.SERVICE_UNAVAILABLE:
        this.code = 'SERVICE_UNAVAILABLE';
        break;
    }
  }
}
