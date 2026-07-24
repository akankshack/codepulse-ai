/**
 * @file app.ts
 * @description Express Application setup configuring security headers, CORS, body parsers, logging, routes, and error handlers.
 * 
 * PURPOSE:
 * Configures the core Express application without binding to a network socket port, allowing clean unit/integration testing.
 * 
 * ROLE IN REQUEST FLOW:
 * Receives raw incoming HTTP requests -> Passes through security middlewares -> Matches routes -> Handled by controllers/middlewares -> Returns HTTP responses.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/environment';
import { mainRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './utils/errors';

const app = express();

// 1. Security Headers Middleware (Helmet)
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS) setup
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Rate Limiting Middleware (Prevent DDoS / Brute Force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      statusCode: 429,
    },
  },
});
app.use('/api', limiter);

// 4. HTTP Request Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. HTTP Request Logging Middleware (Morgan)
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// 6. Mount Master API Router under /api/v1
app.use('/api/v1', mainRouter);

// 7. Catch-All 404 Route Handler for undefined endpoints
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Cannot find path ${req.originalUrl} on this server`));
});

// 8. Global Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
