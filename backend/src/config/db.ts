/**
 * @file db.ts
 * @description Resilient MongoDB Mongoose connection manager with lifecycle event listeners & graceful shutdown.
 * 
 * PURPOSE:
 * Establishes a database connection pool to MongoDB, listens for connection lifecycle state changes,
 * handles automatic retries, and closes connections gracefully upon server termination.
 * 
 * ROLE IN REQUEST FLOW:
 * Initialized during boot in `server.ts` before Express starts accepting client HTTP traffic.
 */

import mongoose from 'mongoose';
import { env } from './environment';
import { logger } from '../utils/logger';

/**
 * Connects to MongoDB using configured URI and options.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // Attach connection event listeners for real-time connection state logging
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection successfully established.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error encountered:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Reconnecting...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB connection restored.');
    });

    // Establish connection pool
    await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error('Failed to establish initial MongoDB connection:', error);
    // Exit process with failure code if initial DB connection cannot be established
    process.exit(1);
  }
};

/**
 * Gracefully disconnects Mongoose connection on process shutdown signals (SIGINT / SIGTERM).
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully.');
  } catch (error) {
    logger.error('Error during MongoDB disconnect:', error);
  }
};
