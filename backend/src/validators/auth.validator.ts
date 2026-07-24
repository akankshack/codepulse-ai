/**
 * @file auth.validator.ts
 * @description Zod validation schemas for incoming Authentication requests.
 * 
 * PURPOSE:
 * Defines structural and data constraints for registration and login HTTP payloads.
 * 
 * ROLE IN REQUEST FLOW:
 * Utilized by `validate.middleware.ts` to validate client inputs before they enter the controllers.
 */

import { z } from 'zod';

/**
 * Validation schema for User Registration.
 */
export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters long')
      .max(50, 'Full name cannot exceed 50 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email address is required' })
      .email('Invalid email address format')
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(30, 'Password cannot exceed 30 characters'),
    role: z
      .enum(['DEVELOPER', 'LEAD', 'ADMIN'], {
        errorMap: () => ({ message: 'Role must be DEVELOPER, LEAD, or ADMIN' }),
      })
      .default('DEVELOPER'),
    avatar: z.string().optional(),
  }),
});

/**
 * Validation schema for User Login.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email address is required' })
      .email('Invalid email address format')
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
