import { STATUS_CODES } from 'http';

import register from 'services/register';

/* global fetchMock */
describe('login', () => {
  it('should allow to send credentials', async () => {
    fetchMock.mockResponseOnce(`{
  "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
  "username": "kristen.williams@example.com",
  "name": "Kristen Williams",
  "picture": "https://i.pravatar.cc/200",
  "bio": "Lorem ipsum dolorem"
}`);
    const body = {
      firstName: 'Kristen',
      lastName: 'Williams',
      email: 'kristen.williams@example.com',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).resolves.toMatchObject({
      id: expect.any(String),
      username: body.email,
      name: `${body.firstName} ${body.lastName}`,
      picture: expect.any(String),
      bio: expect.any(String),
    });
  });

  it('should fail for duplicate user', async () => {
    fetchMock.mockResponse(
      `{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Username or Email already registered"
}`,
      { status: 409 },
    );
    const body = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.me',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).rejects.toThrow(
      'Username or Email already registered',
    );
  });

  it('should fail for validation error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": [
    {
      "children": [],
      "constraints": {
        "isString": "firstName must be a string",
        "minLength": "firstName must be longer than or equal to 1 characters"
      },
      "property": "firstName",
      "value": ""
    },
    {
      "children": [],
      "constraints": {
        "isDefined": "lastName should not be null or undefined",
        "isString": "lastName must be a string",
        "minLength": "lastName must be longer than or equal to 1 characters"
      },
      "property": "lastName",
      "value": null
    },
    {
      "children": [],
      "constraints": {
        "isEmail": "email must be an email"
      },
      "property": "email",
      "value": "jane_doe"
    },
    {
      "children": [],
      "constraints": {
        "minLength": "password must be longer than or equal to 8 characters"
      },
      "property": "password",
      "value": "pwd"
    }
  ]
}`,
      { status: 422 },
    );
    const body = {
      firstName: '',
      lastName: null,
      email: 'jane_doe',
      password: 'pwd',
    };

    await expect(register(body)).rejects.toThrow(/must be an email/);
  });

  it('should fail for server error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 500,
  "error": "Server Error"
}`,
      { status: 500 },
    );

    const body = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.me',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).rejects.toThrow(STATUS_CODES[500]);
  });
});
