import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Env } from '../environment';

type TokenType = 'auth' | 'refresh';

export const JwtService = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  createToken: (type: TokenType, payload: string | Buffer | object): string => {
    const expiryTime =
      type === 'auth'
        ? Env.JWT.AUTH_TOKEN_EXPIRY_TIME
        : Env.JWT.REFRESH_TOKEN_EXPIRY_TIME;
    const options: SignOptions = { expiresIn: expiryTime };
    console.log('----------');
    console.log('options:', options);
    console.log('Env:', Env);
    console.log('----------');
    const authToken = jwt.sign(payload, Env.JWT.SECRET, options);

    return authToken;
  },

  verifyToken: (token: string): JwtPayload | string =>
    jwt.verify(token, Env.JWT.SECRET),
};
