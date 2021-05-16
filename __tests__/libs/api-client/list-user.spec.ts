import listUser from 'src/libs/api-client/list-user';
import server from 'src/utils/test-server';

describe('fetch users', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it.each([
    [1, 0, 10],
    [2, 0, 5],
    [1, 5, 15],
  ])('should list the users', async (page, offset, limit) => {
    const users = await listUser({ page, offset, limit });

    expect(users).toHaveLength(limit);
  });

  it('should abort the request before finished', async () => {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 50);

    await expect(listUser({ signal: ctrl.signal })).rejects.toThrow('Aborted');
  });
});
