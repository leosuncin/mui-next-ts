import {
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';

export type ErrorResponse = {
  readonly statusCode: number;
  readonly message: string;
  readonly errors?: Record<string, string>;
};

export interface HttpError extends Error {
  readonly name: 'HttpError';
  code: string;
  status: number;
  errors?: ErrorResponse['errors'];
}

export class HttpError extends Error implements HttpError {
  readonly name = 'HttpError';

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);

    this.status = error.statusCode;
    switch (error.statusCode) {
      case UNAUTHORIZED:
        this.code = 'UNAUTHORIZED';
        break;

      case FORBIDDEN:
        this.code = 'FORBIDDEN';
        break;

      case NOT_FOUND:
        this.code = 'NOT_FOUND';
        break;

      case METHOD_NOT_ALLOWED:
        this.code = 'METHOD_NOT_ALLOWED';
        break;

      case CONFLICT:
        this.code = 'CONFLICT';
        break;

      case UNPROCESSABLE_ENTITY:
        this.code = 'UNPROCESSABLE_ENTITY';
        this.errors = error.errors;
        break;

      case INTERNAL_SERVER_ERROR:
        this.code = 'INTERNAL_SERVER_ERROR';
        break;

      case SERVICE_UNAVAILABLE:
        this.code = 'SERVICE_UNAVAILABLE';
        break;
    }
  }
}
