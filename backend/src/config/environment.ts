/**
 * @file environment.ts
 * @description Centralized environment configuration loader and schema validator using Zod.
 * 
 * PURPOSE:
 * Ensures all required environment variables (MONGO_URI, PORT, JWT secrets) are validated at server boot.
 * If any critical variable is missing or malformed, the process fails fast with an explicit error message,
 * preventing silent failures deep inside runtime execution.
 * 
 * ROLE IN REQUEST FLOW:
 * Executed during application startup before HTTP server listen or Mongoose connection initialization.
 */

import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { logger } from '../utils/logger';

// Load .env file from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Zod schema enforcing strong types and default fallbacks for backend configuration.
 */
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required for database connectivity'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters long'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

/**
 * Validates process.env against schema and returns frozen environment config object.
 */
const parseEnvironment = () => {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    logger.error('Invalid Environment Configuration:');
    logger.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Environment variable validation failed. Please check your .env file.');
  }

  return result.data;
};

export const env = parseEnvironment();
export type Environment = z.infer<typeof environmentSchema>;
