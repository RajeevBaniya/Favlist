import jwt from 'jsonwebtoken';
import type { CookieOptions } from 'express';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
const JWT_SESSION_EXPIRES_IN = '24h';

if (!JWT_SECRET) {
  throw new Error(
    'FATAL ERROR: JWT_SECRET is not defined in environment variables. ' +
    'Please add JWT_SECRET to your .env file.'
  );
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JWTPayload, rememberMe: boolean = false): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: rememberMe ? JWT_EXPIRES_IN : JWT_SESSION_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const getCookieOptions = (rememberMe: boolean = false): CookieOptions => {
  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  if (rememberMe) {
    return {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  return baseOptions; // Session cookie (expires when browser closes)
};

