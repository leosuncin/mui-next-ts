import register from 'libs/api-client/register';
import {
  ConflictError,
  UnprocessableEntityError,
  UserWithoutPassword,
} from 'types';
import server, { respondWithServiceUnavailable } from 'utils/test-server';

describe('register', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should allow to send credentials', async () => {
    const body = {
      firstName: 'Kristen',
      lastName: 'Williams',
      username: 'kristen.williams',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).resolves.toMatchObject<UserWithoutPassword>({
      id: expect.any(String),
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      picture: expect.any(String),
      bio: expect.any(String),
    });
  });

  it('should fail for duplicate user', async () => {
    const body = {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane_doe',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).rejects.toThrow(ConflictError);
  });

  it('should fail for validation error', async () => {
    const body = {
      firstName: '',
      lastName: null,
      username: 'jane',
      password: 'pwd',
    };

    await expect(register(body)).rejects.toThrow(UnprocessableEntityError);
  });

  it('should fail for server error', async () => {
    server.use(respondWithServiceUnavailable('/api/auth/register', 'post'));
    const body = {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane_doe',
      password: 'Pa$$w0rd!',
    };

    await expect(register(body)).rejects.toThrow();
  });
});
