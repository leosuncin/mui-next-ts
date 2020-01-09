import fetch from 'cross-fetch';

import { ValidationError } from 'libs/validate';
import { Error as ErrorResponse } from 'pages/api/auth/login';

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
    const error = (await resp.json()) as ErrorResponse;
    let message = (error.message as string) || resp.statusText;

    if (Array.isArray(error.message)) {
      message = error.message
        .map((error: ValidationError) => Object.values(error.constraints))
        .flat()
        .join('.\n');
    }

    throw new Error(message);
  }

  return resp.json();
}
