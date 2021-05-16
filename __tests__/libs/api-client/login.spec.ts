import login from '@app/libs/api-client/login';
import { AuthLogin, HttpError, UserWithoutPassword } from '@app/types';
import server, { respondWithServiceUnavailable } from '@app/utils/test-server';

describe('login', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should allow to send credentials', async () => {
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
    const body = {} as unknown as AuthLogin;

    await expect(login(body)).rejects.toThrow(HttpError);
  });

  it('should fail for the incorrect credentials', async () => {
    await expect(
      login({ username: 'admin', password: 'ji32k7au4a83' }),
    ).rejects.toThrow(HttpError);
    await expect(
      login({ username: 'administrator', password: 'ji32k7au4a83' }),
    ).rejects.toThrow(HttpError);
  });

  it('should fail for validation error', async () => {
    const body = { username: 'adm', password: 'Pa$' };

    await expect(login(body)).rejects.toThrow(HttpError);
  });

  it('should fail for server error', async () => {
    const body = { username: 'admin', password: 'Pa$$w0rd!' };
    server.use(respondWithServiceUnavailable('/api/auth/login', 'post'));

    await expect(login(body)).rejects.toThrow(HttpError);
  });
});
