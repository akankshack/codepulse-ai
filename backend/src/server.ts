/**
 * @file server.ts
 * @description Entry point for the CodePulse AI backend service.
 * 
 * PURPOSE:
 * Initializes environment configuration, connects to MongoDB, starts the HTTP server listener on configured port,
 * and attaches OS signal listeners (SIGINT, SIGTERM, unhandledRejection, uncaughtException) for graceful process exit.
 * 
 * ROLE IN REQUEST FLOW:
 * Root execution point launched via `npm run dev` or `node dist/server.js`.
 */

import app from './app';
import { env } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/db';
import { logger } from './utils/logger';

/**
 * Bootstrap function launching database connection and HTTP listener.
 */
const bootstrap = async (): Promise<void> => {
  try {
    logger.info('Initializing CodePulse AI Backend Service...');
    
    // Connect to MongoDB
    await connectDatabase();

    // Start HTTP Server
    const server = app.listen(env.PORT, () => {
      logger.info(`==================================================`);
      logger.info(`🚀 CodePulse AI Server listening on port: ${env.PORT}`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Healthcheck: http://localhost:${env.PORT}/api/v1/health`);
      logger.info(`==================================================`);
    });

    /**
     * Graceful shutdown procedure handling process termination signals.
     */
    const gracefulShutdown = async (signal: string) => {
      logger.warn(`Received ${signal} signal. Initiating graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server stopped accepting new incoming connections.');
        await disconnectDatabase();
        logger.info('CodePulse AI Backend process terminated cleanly.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds timeout if server hangs
      setTimeout(() => {
        logger.error('Forced shutdown triggered after 10 seconds timeout.');
        process.exit(1);
      }, 10000);
    };

    // Attach process signal handlers
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle Unhandled Promise Rejections & Uncaught Exceptions
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Promise Rejection encountered:', reason);
      // Let existing requests finish, then exit
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception thrown:', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Fatal failure during server bootstrap:', error);
    process.exit(1);
  }
};

bootstrap();
