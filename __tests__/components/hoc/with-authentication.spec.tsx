const mockPushRoute = jest.fn();
jest.mock('next/router', () => ({
  push: mockPushRoute,
}));

import { IncomingMessage, ServerResponse } from 'http';

import withAuthentication from 'components/hoc/with-authentication';
import { createMocks } from 'node-mocks-http';

describe('withAuthentication HOC', () => {
  afterEach(() => {
    mockPushRoute.mockReset();
  });

  describe('server side', () => {
    it('should redirect', async () => {
      const { req, res } = createMocks<IncomingMessage, ServerResponse>();
      const ctx: any = { req, res };

      await withAuthentication(jest.fn()).getInitialProps(ctx);

      expect(res._isEndCalled()).toBe(true);
      expect(res._getStatusCode()).toBe(302);
      expect(mockPushRoute).not.toHaveBeenCalled();
    });

    it('should get session user', async () => {
      const { req, res } = createMocks<IncomingMessage, ServerResponse>({
        headers: {
          cookie: `sessionUser={%22id%22:%22e7d65ad3-7cf2-4b32-a12c-500ac468c209%22%2C%22username%22:%22admin%22%2C%22name%22:%22Administrator%22%2C%22picture%22:%22https://i.pravatar.cc/200%22%2C%22bio%22:%22Lorem%20ipsum%20dolorem%22}`,
        },
      });
      const ctx: any = { req, res };

      await expect(
        withAuthentication(jest.fn()).getInitialProps(ctx),
      ).resolves.toBeDefined();
    });
  });

  describe('client side', () => {
    let oldProcessBrowser: boolean | undefined;

    beforeAll(() => {
      oldProcessBrowser = process.browser;
      Object.assign(process, { browser: true });
    });

    afterAll(() => {
      Object.assign(process, { browser: oldProcessBrowser });
    });

    it('should redirect', async () => {
      const ctx: any = {};

      await withAuthentication(jest.fn()).getInitialProps(ctx);

      expect(mockPushRoute).toHaveBeenCalled();
    });
  });
});
