/**
 * @file auth.controller.ts
 * @description HTTP Controller handling user registration, logins, session queries, and logouts.
 * 
 * PURPOSE:
 * Bridges HTTP routing calls to core `AuthService` methods, mapping domain results
 * to clean JSON APIs and cookie-based sessions.
 * 
 * ROLE IN REQUEST FLOW:
 * Receives Express route inputs -> Invokes AuthService logic -> Responds with status codes & JSON.
 */

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';
import { UnauthorizedError } from '../utils/errors';
import { env } from '../config/environment';

export class AuthController {
  /**
   * Helper that sets the refresh token in a secure, HttpOnly browser cookie.
   */
  private setRefreshCookie(res: Response, token: string): void {
    res.cookie('codepulse_refresh_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  }

  /**
   * Helper that clears the refresh token cookie.
   */
  private clearRefreshCookie(res: Response): void {
    res.clearCookie('codepulse_refresh_token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  /**
   * Handles POST /api/v1/auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password, role, avatar } = req.body;

    const { user, tokens } = await authService.registerUser({
      fullName,
      email,
      password,
      role,
      avatar,
    });

    this.setRefreshCookie(res, tokens.refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account successfully registered',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  };

  /**
   * Handles POST /api/v1/auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, tokens } = await authService.authenticateUser({
      email,
      password,
    });

    this.setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  };

  /**
   * Handles POST /api/v1/auth/logout
   */
  public logout = async (_req: Request, res: Response): Promise<void> => {
    this.clearRefreshCookie(res);
    res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  };

  /**
   * Handles GET /api/v1/auth/me
   */
  public getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication session not found');
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedError('User account no longer exists in system');
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  };

  /**
   * Handles POST /api/v1/auth/refresh
   * Decodes HTTP cookie refresh token and returns a fresh Access Token.
   */
  public refresh = async (req: Request, res: Response): Promise<void> => {
    // Read cookie header manually or rely on parse
    const cookies = req.headers.cookie;
    let refreshToken: string | undefined;

    if (cookies) {
      const match = cookies.match(/codepulse_refresh_token=([^;]+)/);
      if (match) {
        refreshToken = match[1];
      }
    }

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh session token is missing');
    }

    const newAccessToken = await authService.refreshUserSession(refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  };
}

export const authController = new AuthController();
export default authController;
