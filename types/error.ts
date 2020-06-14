export type ErrorResponse = {
  readonly statusCode: number;
  readonly message: string;
  readonly errors?: Record<string, string>;
};

export type HttpError = Error & {
  code: string;
  error: ErrorResponse;
};

export class UnauthorizedError extends Error {
  readonly name = 'UnauthorizedError';
  readonly code = 'UNAUTHORIZED';
  readonly status = 401;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class ForbiddenError extends Error {
  readonly name = 'ForbiddenError';
  readonly code = 'FORBIDDEN';
  readonly status = 403;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class NotFoundError extends Error {
  readonly name = 'NotFoundError';
  readonly code = 'NOT_FOUND';
  readonly status = 404;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class MethodNotAllowedError extends Error {
  readonly name = 'MethodNotAllowedError';
  readonly code = 'METHOD_NOT_ALLOWED';
  readonly status = 405;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class ConflictError extends Error {
  readonly name = 'ConflictError';
  readonly code = 'CONFLICT';
  readonly status = 409;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class UnprocessableEntityError extends Error {
  readonly name = 'UnprocessableEntityError';
  readonly code = 'UNPROCESSABLE_ENTITY';
  readonly status = 422;
  errors: ErrorResponse['errors'];

  constructor(error: ErrorResponse) {
    super(Object.values(error.errors).join('.\n'));
    Object.setPrototypeOf(this, new.target.prototype);
    this.errors = error.errors;

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class ServiceUnavailableError extends Error {
  readonly name = 'ServiceUnavailableError';
  readonly code = 'SERVICE_UNAVAILABLE';
  readonly status = 503;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export class InternalServerError extends Error {
  readonly name = 'InternalServerError';
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly status = 500;

  constructor(error: ErrorResponse) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}
