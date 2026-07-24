/**
 * @file validate.middleware.ts
 * @description Express middleware for validating HTTP request payloads (body, params, query) using Zod schemas.
 * 
 * PURPOSE:
 * Ensures incoming HTTP requests adhere to declared contracts before reaching controller or service layers.
 * If validation fails, throws a 400 Bad Request error with explicit field-by-field error details.
 * 
 * ROLE IN REQUEST FLOW:
 * Placed before route controllers: `router.post('/login', validate(loginSchema), loginController)`
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

/**
 * Validates request data against provided Zod schema.
 * 
 * @param schema Zod schema defining body, query, and/or params constraints
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        
        const errMessage = formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', ');
        next(new BadRequestError(`Validation failed - ${errMessage}`));
      } else {
        next(error);
      }
    }
  };
};
