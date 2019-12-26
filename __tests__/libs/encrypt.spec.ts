jest.mock('crypto');

import { hashPassword, comparePassword } from 'libs/encrypt';

describe('encrypt', () => {
  it('should hash the password', () => {
    expect(hashPassword('Pa$$w0rd!')).toBe(
      'MjE2NDcyMzA3NzI0MjQ2MTUwOjAwMDAwMDAwMDAwMDAwMDA=',
    );
  });

  it('should compare the encrypted password', () => {
    expect(
      comparePassword(
        'MjE2NDcyMzA3NzI0MjQ2MTUwOjAwMDAwMDAwMDAwMDAwMDA=',
        'Pa$$w0rd!',
      ),
    ).toBe(true);
  });
});
