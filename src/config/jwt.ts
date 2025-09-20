import { FastifyJWTOptions } from '@fastify/jwt';

export function configureJWT(): FastifyJWTOptions {
  return {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    verify: {
      cache: true,
    },
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
  };
}

export const refreshTokenConfig = {
  secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-here',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};