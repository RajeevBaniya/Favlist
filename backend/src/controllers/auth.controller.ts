import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { generateToken, getCookieOptions } from '../utils/jwt.util.js';
import { HTTP_STATUS } from '../utils/constants.js';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

class AuthController {
  async signup(
    req: Request<object, object, SignupInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.signup(req.body);

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.cookie('authToken', token, getCookieOptions(false));

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
        res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: 'An account with this email already exists',
        });
        return;
      }
      next(error);
    }
  }

  async login(
    req: Request<object, object, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rememberMe } = req.body;
      const user = await authService.login(req.body);

      const token = generateToken(
        {
          userId: user.id,
          email: user.email,
        },
        rememberMe
      );

      res.cookie('authToken', token, getCookieOptions(rememberMe));

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_NOT_FOUND') {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'No account found with this email address',
        });
        return;
      }

      if (error instanceof Error && error.message === 'WRONG_PASSWORD') {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Incorrect password',
        });
        return;
      }

      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
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
  }

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const user = await authService.getUserById(req.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

