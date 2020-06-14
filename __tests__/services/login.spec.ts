import login from 'services/login';
import {
  UnauthorizedError,
  UnprocessableEntityError,
  UserWithoutPassword,
} from 'types';

/* global fetchMock */
describe('login', () => {
  it('should allow to send credentials', async () => {
    fetchMock.mockResponseOnce(`{
  "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
  "username": "admin",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://i.pravatar.cc/200",
  "bio": "Lorem ipsum dolorem"
}`);
    const body = { username: 'admin', password: 'Pa$$w0rd!' };

    await expect(login(body)).resolves.toMatchObject<UserWithoutPassword>({
      id: expect.any(String),
      username: body.username,
      firstName: expect.any(String),
      lastName: expect.any(String),
      picture: expect.any(String),
      bio: expect.any(String),
    });
  });

  it('should fail for missing credentials', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 422,
  "message": "Validation errors",
  "errors": {
    "password": "Password is a required field",
    "username": "Username must be at least 5 characters"
  }
}`,
      { status: 422 },
    );
    const body: any = {};

    await expect(login(body)).rejects.toThrow(UnprocessableEntityError);
  });

  it('should fail for the incorrect credentials', async () => {
    fetchMock.mockResponse(
      `{
  "statusCode": 401,
  "message": "Wrong password for user: admin"
}`,
      { status: 401 },
    );
    const body = { username: 'admin', password: 'ji32k7au4a83' };

    await expect(login(body)).rejects.toThrow(UnauthorizedError);
  });

  it('should fail for validation error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 422,
  "message": "Validation errors",
  "errors": {
    "password": "Password must be at least 8 characters",
    "username": "Username must be at least 5 characters"
  }
}`,
      { status: 422 },
    );
    const body = { username: 'adm', password: 'Pa$' };

    await expect(login(body)).rejects.toThrow(UnprocessableEntityError);
  });

  it('should fail for server error', async () => {
    fetchMock.mockResponseOnce(
      `{
  "statusCode": 503,
  "message": "Database connection error"
}`,
      { status: 503 },
    );

    const body = { username: 'admin', password: 'Pa$$w0rd!' };

    await expect(login(body)).rejects.toThrow();
  });
});
