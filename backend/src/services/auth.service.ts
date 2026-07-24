/**
 * @file auth.service.ts
 * @description Authentication service layer executing domain logic (JWT generation, password hashing, and token validation).
 * 
 * PURPOSE:
 * Implements business operations for authentication, separating raw transport (controllers) and database operations.
 * Uses jsonwebtoken and bcryptjs.
 * 
 * ROLE IN REQUEST FLOW:
 * Called by `AuthController` to register new users, verify login credentials, or refresh expired sessions.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/environment';
import { userRepository } from '../repositories/user.repository';
import { IUserDocument } from '../models/user.model';
import { ConflictError, UnauthorizedError } from '../utils/errors';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'DEVELOPER' | 'LEAD' | 'ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Encrypts plain-text passwords using bcryptjs (12 salt rounds).
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares plain-text passwords against encrypted password hashes.
   */
  public async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Generates short-lived Access and long-lived Refresh JWTs.
   */
  public generateTokens(user: IUserDocument): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Registers a brand new user into the platform.
   * Throws ConflictError if email address is already occupied.
   */
  public async registerUser(userData: {
    fullName: string;
    email: string;
    password: string;
    role: 'DEVELOPER' | 'LEAD' | 'ADMIN';
    avatar?: string;
  }): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('A user account with this email address already exists');
    }

    // Encrypt password
    const passwordHash = await this.hashPassword(userData.password);

    // Save record
    const newUser = await userRepository.create({
      fullName: userData.fullName,
      email: userData.email,
      passwordHash,
      role: userData.role,
      avatar: userData.avatar,
    });

    // Produce JWTs
    const tokens = this.generateTokens(newUser);

    return { user: newUser, tokens };
  }

  /**
   * Authenticates user login credentials.
   * Throws UnauthorizedError if password does not match or email is not registered.
   */
  public async authenticateUser(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email address or password entered');
    }

    const isMatch = await this.comparePassword(credentials.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email address or password entered');
    }

    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  /**
   * Verifies an access token and returns parsed payload.
   */
  public verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Access token is invalid or has expired');
    }
  }

  /**
   * Verifies a refresh token and yields a brand new Access Token.
   */
  public async refreshUserSession(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;
      
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError('User session no longer exists');
      }

      // Re-sign new access token
      const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any,
      });
    } catch {
      throw new UnauthorizedError('Refresh token is invalid or has expired. Please sign in again.');
    }
  }
}

export const authService = new AuthService();
export default authService;
