import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

export const errorHandler = (
  err: Error | PrismaError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma errors
  const prismaError = err as PrismaError;
  if (prismaError.code) {
    if (prismaError.code === 'P2002') {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: 'Resource already exists',
      });
      return;
    }

    if (prismaError.code === 'P2025') {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_MESSAGES.NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    });
    return;
  }

  // Default error
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? ERROR_MESSAGES.INTERNAL_ERROR 
      : err.message,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};

