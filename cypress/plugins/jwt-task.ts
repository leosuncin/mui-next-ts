import { Secret, SignOptions, sign } from 'jsonwebtoken';

import { signJWT } from '../../libs/jwt';

export type SignParams = {
  payload: string | Record<string, any>;
  secret?: string;
  options?: SignOptions;
};

interface JwtTask {
  /**
   * Sign a new JWT
   *
   * @param {SignParams} params
   * @returns {string} JSON Web Token
   */
  signToken(params: SignParams): string;
  /**
   * Create a JWT from user
   *
   * @param {Object} user
   * @returns {string} JSON Web Token
   */
  signUser(user: Parameters<typeof signJWT>[0]): string;
}

/**
 * Task to create JSON Web Tokens
 *
 * @param {Secret}      secretOrPrivateKey      Secret string o private encrypt key
 * @param {SignOptions} [defaultSingOptions={}] Default sign options to use later
 * @returns {JwtTask} Tasks object
 */
export default function jwtTask(
  secretOrPrivateKey: Secret,
  defaultSingOptions: SignOptions = {},
): JwtTask {
  if (!secretOrPrivateKey) throw new Error('Secret or private key is required');

  return {
    signToken({ payload, secret, options = {} }) {
      return sign(
        payload,
        secret ?? secretOrPrivateKey,
        Object.assign(options, defaultSingOptions),
      );
    },
    signUser(user) {
      return signJWT(user);
    },
  };
}
