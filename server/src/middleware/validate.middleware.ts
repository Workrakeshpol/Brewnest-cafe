import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Middleware that validates request data against a Zod schema.
 * Throws a ValidationError with structured messages if validation fails.
 */
export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[source];
      const parsedData = schema.parse(dataToValidate);
      
      // Replace the request source with the validated and typed data
      req[source] = parsedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        
        next(new ValidationError(`Validation failed: ${errorMessages}`));
      } else {
        next(error);
      }
    }
  };
}
