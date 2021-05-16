import { ErrorResponse, HttpError } from 'src/types';

const defaultOptions: RequestInit = { mode: 'cors', credentials: 'include' };

async function fetcher<Data>(
  input: RequestInfo,
  options: RequestInit,
): Promise<Data> {
  const resp = await fetch(input, options);
  let result: Data | ErrorResponse;

  if (resp.status === 204) return undefined;

  try {
    const text = await resp.text();
    result = JSON.parse(text);
  } catch {
    result = {
      statusCode: resp.status,
      message: resp.statusText,
    } as ErrorResponse;
  }

  if (resp.status < 400) return result as Data;

  throw new HttpError(result as ErrorResponse);
}

export function post<Body, Data>(
  request: RequestInfo,
  body: Body,
  signal?: AbortSignal,
): Promise<Data> {
  return fetcher(request, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal,
  });
}

export function get<Data>(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<Data> {
  return fetcher(request, { ...defaultOptions, signal });
}

export function remove(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<void> {
  return fetcher(request, {
    ...defaultOptions,
    method: 'DELETE',
    signal,
  });
}

export function put<Body, Data>(
  request: RequestInfo,
  body: Body,
  signal?: AbortSignal,
): Promise<Data> {
  return fetcher(request, {
    ...defaultOptions,
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal,
  });
}
