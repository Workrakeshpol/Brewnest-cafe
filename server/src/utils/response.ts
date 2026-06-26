import { Response } from 'express';
import { AppError } from './errors.js';
import { logger } from './logger.js';

interface StandardResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Send a success response.
 */
export function successResponse<T>(
  res: Response,
  data: T,
  statusCode = 200
): Response {
  const responseBody: StandardResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(responseBody);
}

/**
 * Send an error response.
 */
export function errorResponse(
  res: Response,
  error: unknown,
  statusCode = 500
): Response {
  let message = 'An unexpected error occurred';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: unknown = undefined;
  let status = statusCode;

  if (error instanceof AppError) {
    message = error.message;
    code = error.code;
    status = error.statusCode;
  } else if (error instanceof Error) {
    message = error.message;
    // Log unexpected system errors
    logger.error('Unexpected System Error', { stack: error.stack });
  } else {
    logger.error('Unknown Error Type', { error });
  }

  const responseBody: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };

  if (details !== undefined) {
    responseBody.error.details = details;
  }

  return res.status(status).json(responseBody);
}

/**
 * Send a paginated success response.
 */
export function paginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode = 200
): Response {
  const totalPages = Math.ceil(total / limit);
  const responseBody: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
  return res.status(statusCode).json(responseBody);
}
