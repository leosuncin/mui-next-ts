import {
  ACCEPTED,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
  UnprocessableEntityError,
} from 'types';

const defaultOptions: RequestInit = { mode: 'cors', credentials: 'include' };

export async function post<Body, Data>(
  request: RequestInfo,
  body: Body,
): Promise<Data> {
  const resp = await fetch(request, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await resp.json();

  switch (resp.status) {
    case UNAUTHORIZED:
      throw new UnauthorizedError(result);

    case FORBIDDEN:
      throw new ForbiddenError(result);

    case NOT_FOUND:
      throw new NotFoundError(result);

    case METHOD_NOT_ALLOWED:
      throw new MethodNotAllowedError(result);

    case CONFLICT:
      throw new ConflictError(result);

    case UNPROCESSABLE_ENTITY:
      throw new UnprocessableEntityError(result);

    case INTERNAL_SERVER_ERROR:
      throw new InternalServerError(result);

    case SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError(result);

    case OK:
    case CREATED:
    case ACCEPTED:
      return result as Data;
  }
}

export async function get<Data>(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<Data> {
  const resp = await fetch(request, { ...defaultOptions, signal });
  const result = await resp.json();

  switch (resp.status) {
    case UNAUTHORIZED:
      throw new UnauthorizedError(result);

    case FORBIDDEN:
      throw new ForbiddenError(result);

    case NOT_FOUND:
      throw new NotFoundError(result);

    case METHOD_NOT_ALLOWED:
      throw new MethodNotAllowedError(result);

    case INTERNAL_SERVER_ERROR:
      throw new InternalServerError(result);

    case SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError(result);

    case OK:
      return result as Data;

    case NO_CONTENT:
      return;
  }
}

export async function remove(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<void> {
  const resp = await fetch(request, {
    ...defaultOptions,
    method: 'DELETE',
    signal,
  });

  if (resp.status < 400) return;

  const error = await resp.json();
  switch (resp.status) {
    case UNAUTHORIZED:
      throw new UnauthorizedError(error);

    case FORBIDDEN:
      throw new ForbiddenError(error);

    case NOT_FOUND:
      throw new NotFoundError(error);

    case METHOD_NOT_ALLOWED:
      throw new MethodNotAllowedError(error);

    case INTERNAL_SERVER_ERROR:
      throw new InternalServerError(error);

    case SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError(error);
  }
}

export async function put<Body, Data>(
  request: RequestInfo,
  body: Body,
): Promise<Data> {
  const resp = await fetch(request, {
    ...defaultOptions,
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await resp.json();

  switch (resp.status) {
    case UNAUTHORIZED:
      throw new UnauthorizedError(result);

    case FORBIDDEN:
      throw new ForbiddenError(result);

    case NOT_FOUND:
      throw new NotFoundError(result);

    case METHOD_NOT_ALLOWED:
      throw new MethodNotAllowedError(result);

    case CONFLICT:
      throw new ConflictError(result);

    case UNPROCESSABLE_ENTITY:
      throw new UnprocessableEntityError(result);

    case INTERNAL_SERVER_ERROR:
      throw new InternalServerError(result);

    case SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError(result);

    case OK:
      return result as Data;
  }
}
