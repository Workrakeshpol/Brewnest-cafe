import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, ConflictError, NotFoundError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Global error handling middleware.
 * Catches all errors thrown in routes, logs them, and returns a formatted JSON response.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Log the error details internally
  const errorDetails = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    errorMessage: err.message,
    stack: err.stack,
  };

  let mappedError = err;

  // Map database/Prisma errors to standard AppErrors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      mappedError = new ConflictError(`A record with this ${target} already exists.`);
    } else if (err.code === 'P2025') {
      mappedError = new NotFoundError('The requested record could not be found.');
    } else {
      logger.error(`Prisma Client Error (${err.code}): ${err.message}`, errorDetails);
      mappedError = new AppError('A database error occurred.', 500, 'DATABASE_ERROR');
    }
  }

  if (mappedError instanceof AppError) {
    if (mappedError.statusCode >= 500) {
      logger.error(`App Error (${mappedError.code}): ${mappedError.message}`, errorDetails);
    } else {
      logger.warn(`App Warning (${mappedError.code}): ${mappedError.message}`, { path: req.path, method: req.method });
    }
    errorResponse(res, mappedError);
  } else {
    // Unknown system/runtime error: Log it, but mask the detailed error message in production
    logger.error('Unhandled System Error', errorDetails);
    
    const clientMessage = env.NODE_ENV === 'production' 
      ? 'An unexpected system error occurred. Please try again later.'
      : err.message;

    res.status(500).json({
      success: false,
      error: {
        message: clientMessage,
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
}
