import type { Request, Response, NextFunction } from 'express';
import { signup, login, getUserById } from '../services/auth.service.js';
import { generateToken, getCookieOptions } from '../utils/jwt.util.js';
import { HTTP_STATUS } from '../utils/constants.js';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// Pure utility functions
const handleAuthError = (error: unknown, res: Response, next: NextFunction): boolean => {
  if (!(error instanceof Error)) {
    next(error);
    return true;
  }

  switch (error.message) {
    case 'EMAIL_EXISTS':
        res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: 'An account with this email already exists',
        });
      return true;
    case 'EMAIL_NOT_FOUND':
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'No account found with this email address',
        });
      return true;
    case 'WRONG_PASSWORD':
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Incorrect password',
        });
      return true;
    default:
      next(error);
      return true;
    }
};

const createAuthResponse = (user: any, message: string) => ({
  success: true,
  data: user,
  message,
});

const setAuthCookie = (res: Response, user: any, rememberMe = false) => {
  const token = generateToken({
    userId: user.id,
    email: user.email,
  }, rememberMe);

  res.cookie('authToken', token, getCookieOptions(rememberMe));
  return token;
};

// Pure controller functions
const signupHandler = async (
  req: Request<object, object, SignupInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await signup(req.body);
    setAuthCookie(res, user);

    res.status(HTTP_STATUS.CREATED).json(
      createAuthResponse(user, 'User created successfully')
    );
  } catch (error) {
    handleAuthError(error, res, next);
  }
};

const loginHandler = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rememberMe } = req.body;
    const user = await login(req.body);
    setAuthCookie(res, user, rememberMe);

    res.status(HTTP_STATUS.OK).json(
      createAuthResponse(user, 'Login successful')
    );
  } catch (error) {
    handleAuthError(error, res, next);
  }
};

const logoutHandler = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout successful',
    });
};

const meHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

    const user = await getUserById(req.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
};

// Export individual functions
export { signupHandler, loginHandler, logoutHandler, meHandler };

// Default export object for backward compatibility
const authController = {
  signup: signupHandler,
  login: loginHandler,
  logout: logoutHandler,
  me: meHandler,
};

export default authController;

