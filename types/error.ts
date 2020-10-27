import { StatusCodes } from 'http-status-codes';
import type { ValidationError } from 'yup';

export interface ErrorResponse {
  readonly message: string;
  readonly statusCode: number;
  readonly errors?: Record<string, string>;
}

export class HttpApiError extends Error {
  readonly name = 'HttpApiError';

  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly context?: Error | Record<string, string>,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }

  static isHttpApiError(error: Error): error is HttpApiError {
    return (
      error.name === this.name &&
      Object.prototype.hasOwnProperty.call(error, 'statusCode')
    );
  }
}

export class ServiceUnavailableError extends HttpApiError {
  constructor(message: string, error: Error) {
    super(message, StatusCodes.SERVICE_UNAVAILABLE, error);
  }
}

export class MethodNotAllowedError extends HttpApiError {
  constructor(methods: string[]) {
    super(
      `Allowed method(s): ${methods.join(', ')}`,
      StatusCodes.METHOD_NOT_ALLOWED,
    );
  }
}

export class UnprocessableEntityError extends HttpApiError {
  constructor(message: string, errors: Record<string, string>) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, errors);
  }

  static transformValidationError(
    error: ValidationError,
  ): Record<string, string> {
    return error.inner.reduce(
      (prev, error) => ({ ...prev, [error.path]: error.errors[0] }),
      {},
    );
  }
}

export class UnauthorizedError extends HttpApiError {
  constructor(message: string, context?: Error) {
    super(message, StatusCodes.UNAUTHORIZED, context);
  }
}

export class ForbiddenError extends HttpApiError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class ConflictError extends HttpApiError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
  }
}

export class NotFoundError extends HttpApiError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class HttpError extends Error implements ErrorResponse {
  readonly name = 'HttpError';
  readonly statusCode: number;
  readonly errors?: Record<string, string>;

  constructor({ message, statusCode, errors }: ErrorResponse) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static isHttpError(error: Error): error is HttpError {
    return (
      error.name === this.name &&
      Object.prototype.hasOwnProperty.call(error, 'statusCode')
    );
  }
}
