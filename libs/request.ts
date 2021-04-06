import { ErrorResponse, HttpError } from 'types';

const defaultOptions: RequestInit = { mode: 'cors', credentials: 'include' };

async function fetcher<Data>(
  input: RequestInfo,
  options: RequestInit,
): Promise<Data> {
  const resp = await fetch(input, options);
  let result: Data | ErrorResponse;

  if (resp.status === 204) return;

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

export async function post<Body, Data>(
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

export async function get<Data>(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<Data> {
  return fetcher(request, { ...defaultOptions, signal });
}

export async function remove(
  request: RequestInfo,
  signal?: AbortSignal,
): Promise<void> {
  return fetcher(request, {
    ...defaultOptions,
    method: 'DELETE',
    signal,
  });
}

export async function put<Body, Data>(
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
