import fetchMock from 'jest-fetch-mock';
import getAuthUser from 'libs/api-client/get-auth-user';
import { UserWithoutPassword as User } from 'types';

fetchMock.enableMocks();

describe('Fetch authenticated user', () => {
  it('should get authenticated user', async () => {
    fetchMock.mockResponseOnce(`{
      "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
      "username": "admin",
      "firstName": "John",
      "lastName": "Doe",
      "picture": "https://i.pravatar.cc/200",
      "bio": "Lorem ipsum dolorem"
    }`);

    await expect(getAuthUser()).resolves.toMatchObject<User>({
      id: expect.any(String),
      username: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      picture: expect.any(String),
      bio: expect.any(String),
    });
  });
});
