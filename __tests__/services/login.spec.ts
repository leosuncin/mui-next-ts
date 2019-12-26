import { STATUS_CODES } from 'http';

import login from 'services/login';

/* global fetchMock */
describe('login', () => {
  it('should allow to send credentials', async () => {
    fetchMock.mockResponseOnce(`{
  "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
  "username": "admin",
  "name": "Administrator",
  "picture": "https://i.pravatar.cc/200",
  "bio": "Lorem ipsum dolorem"
}`);
    const body = { username: 'admin', password: 'Pa$$w0rd!' };

    await expect(login(body)).resolves.toMatchObject({
      id: expect.any(String),
      username: body.username,
      name: expect.any(String),
      picture: expect.any(String),
      bio: expect.any(String),
    });
  });

  it('should fail for missing credentials', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 401,
  "error": "Unauthorized"
}`,
      { status: 401 },
    );
    const body: any = {};

    await expect(login(body)).rejects.toThrow(STATUS_CODES[401]);
  });

  it('should fail for the incorrect credentials', async () => {
    fetchMock.mockResponse(
      `{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Wrong password for user with username: admin"
}`,
      { status: 401 },
    );
    const body = { username: 'admin', password: 'ji32k7au4a83' };

    await expect(login(body)).rejects.toThrow(/Wrong password/i);
  });

  it('should fail for validation error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": [
    {
      "value": "adm",
      "property": "username",
      "children": [],
      "constraints": {
        "minLength": "username must be longer than or equal to 5 characters"
      }
    },
    {
      "value": "Pa$",
      "property": "password",
      "children": [],
      "constraints": {
        "minLength": "password must be longer than or equal to 8 characters"
      }
    }
  ]
}`,
      { status: 422 },
    );
    const body = { username: 'adm', password: 'Pa$' };

    await expect(login(body)).rejects.toThrow(
      /must be longer than or equal to/,
    );
  });

  it('should fail for server error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 500,
  "error": "Server Error"
}`,
      { status: 500 },
    );

    const body = { username: 'admin', password: 'Pa$$w0rd!' };

    await expect(login(body)).rejects.toThrow();
  });
});
