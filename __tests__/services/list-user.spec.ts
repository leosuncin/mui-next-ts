/* global fetchMock */
import { listUser } from 'services';

const users = [
  {
    id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
    firstName: 'John',
    lastName: 'Doe',
    username: 'admin',
    password:
      'MTc3NzI2ZmE4ZTUwYThhMWFhNWU0MjBjNzQyNzRjZDI6MzBjY2Y5ZDAxMzFiNmZkNQ==',
    picture: 'https://i.pravatar.cc/200',
    bio:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'jane_doe',
    password:
      'OTQ1Yzk1NWVlYWI3ZDNkOWYyMjA4MGI1YjIwMmI4MzA6MWIzMmQxMDUwZjRlMTFiMw==',
    picture: 'https://i.pravatar.cc/200',
    bio:
      'She had this enormous capacity for wonder, and lived by the Golden Rule.',
  },
];

describe('fetch users', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    [1, 0, 10],
    [2, 0, 5],
    [1, 5, 15],
  ])('should list the users', async (page, offset, limit) => {
    fetchMock.mockResponseOnce(JSON.stringify(users));

    await expect(listUser({ page, offset, limit })).resolves.toStrictEqual(
      users,
    );
  });

  it('should abort the request before finished', () => {
    const ctrl = new AbortController();

    fetchMock.mockResponse(async () => {
      jest.advanceTimersByTime(60);
      return '';
    });
    setTimeout(() => ctrl.abort(), 50);

    return expect(listUser({ signal: ctrl.signal })).rejects.toThrow(
      'The operation was aborted. ',
    );
  });
});
