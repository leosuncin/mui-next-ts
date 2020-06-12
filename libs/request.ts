import { Error as ErrorResponse } from 'types';

const options: RequestInit = { mode: 'cors', credentials: 'include' };

export async function post<Body, Data>(
  request: RequestInfo,
  body: Body,
): Promise<Data> {
  const resp = await fetch(request, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (resp.status >= 400) {
    const error: ErrorResponse = await resp.json();
    let message = error.message ?? resp.statusText;

    if (error.errors) {
      message = Object.values(error.errors).join('.\n');
    }

    throw new Error(message);
  }

  return resp.json();
}
