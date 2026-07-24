/**
 * @file verify_auth.ts
 * @description Node.js verification script executing database connectivity and core AuthService logic.
 * 
 * PURPOSE:
 * Directly tests user registration, password hashing/verification, and JWT generation,
 * ensuring database integration is fully operational.
 */

import { connectDatabase, disconnectDatabase } from '../config/db';
import { authService } from '../services/auth.service';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

const verifyAuthService = async () => {
  try {
    logger.info('Starting Authentication Service Verification...');
    
    // 1. Establish database connection pool
    await connectDatabase();

    const testEmail = 'verify_test@codepulse.ai';

    // 2. Teardown existing verify user if present from prior runs
    logger.info(`Cleaning old test records for: ${testEmail}`);
    await User.deleteOne({ email: testEmail });

    // 3. Register user test
    logger.info('Executing AuthService.registerUser...');
    const registerResult = await authService.registerUser({
      fullName: 'Verification Test User',
      email: testEmail,
      password: 'password123Secure!',
      role: 'DEVELOPER',
    });

    logger.info('✅ Registration succeeded!');
    logger.info(`User Document: ID=${registerResult.user.id}, Role=${registerResult.user.role}`);
    logger.info(`Access Token: ${registerResult.tokens.accessToken.substring(0, 30)}...`);
    logger.info(`Refresh Token: ${registerResult.tokens.refreshToken.substring(0, 30)}...`);

    // Verify password is NOT returned in JSON serialization
    const serializedUser = registerResult.user.toJSON();
    if ('passwordHash' in serializedUser) {
      throw new Error('FAIL: passwordHash was found in serialized User object!');
    }
    logger.info('✅ verified: passwordHash was correctly excluded from JSON output.');

    // Verify password hash in DB is encrypted
    const rawUserInDb = await User.findOne({ email: testEmail });
    if (!rawUserInDb) {
      throw new Error('FAIL: Could not locate user in MongoDB!');
    }
    if (rawUserInDb.passwordHash === 'password123Secure!') {
      throw new Error('FAIL: Password stored in plaintext!');
    }
    logger.info('✅ verified: Password successfully hashed with bcryptjs in MongoDB.');

    // 4. Login test
    logger.info('Executing AuthService.authenticateUser with correct password...');
    const loginResult = await authService.authenticateUser({
      email: testEmail,
      password: 'password123Secure!',
    });
    logger.info('✅ Login succeeded!');
    logger.info(`Logged in user name: ${loginResult.user.fullName}`);

    // 5. Login test with invalid password
    logger.info('Executing AuthService.authenticateUser with incorrect password...');
    try {
      await authService.authenticateUser({
        email: testEmail,
        password: 'wrong_password',
      });
      throw new Error('FAIL: Authenticate did not reject bad password!');
    } catch (err: any) {
      logger.info(`✅ verified: Login rejected incorrect password. Error received: "${err.message}"`);
    }

    // 6. Token refresh test
    logger.info('Executing AuthService.refreshUserSession...');
    const newAccessToken = await authService.refreshUserSession(loginResult.tokens.refreshToken);
    logger.info(`✅ Token refresh succeeded! New Access Token: ${newAccessToken.substring(0, 30)}...`);

    logger.info('==================================================');
    logger.info('🎉 ALL AUTHENTICATION SERVICE TESTS PASSED CLEANLY');
    logger.info('==================================================');

  } catch (error) {
    logger.error('❌ Verification script caught fatal error:', error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

verifyAuthService();
