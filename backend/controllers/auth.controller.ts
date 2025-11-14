import { Request, Response } from 'express';
import { AuthUtils } from '../utils/auth.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { RegisterDto, LoginDto, AuthResponse } from '../types/dtos';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, password, role_id }: RegisterDto = req.body;

      // Validation
      if (!first_name || !last_name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide first_name, last_name, email, and password',
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
        return;
      }

      // Password validation
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      // Check if trying to create an admin user (role_id === 1)
      if (role_id === 1) {
        // Only authenticated admins can create admin users
        if (!req.user || req.user.role_id !== 1) {
          res.status(403).json({
            success: false,
            message: 'Only administrators can create admin users',
          });
          return;
        }
      }

      // Check if user already exists
      const existingUser = await AuthUtils.emailExists(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Create user
      const user = await AuthUtils.createUser({
        first_name,
        last_name,
        email,
        password,
        role_id: role_id || 2, // Default to 'user' role
      });

      // Generate JWT token
      const token = JwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        role_id: user.role_id,
      });

      const response: AuthResponse = {
        access_token: token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role_id: user.role_id,
        },
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: response,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide email and password',
        });
        return;
      }

      // Find user by email
      const user = await AuthUtils.findUserByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await AuthUtils.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT tokens
      const payload = {
        userId: user.id,
        email: user.email,
        role_id: user.role_id,
      };

      const accessToken = JwtUtils.generateToken(payload);
      const refreshToken = JwtUtils.generateRefreshToken(payload);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      const response: AuthResponse = {
        access_token: accessToken,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role_id: user.role_id,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: response,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Refresh access token using refresh token from cookie
   * POST /auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token not found',
        });
        return;
      }

      // Verify refresh token
      const decoded = JwtUtils.verifyRefreshToken(refreshToken);

      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
        return;
      }

      // Generate new access token
      const newAccessToken = JwtUtils.generateToken({
        userId: decoded.userId,
        email: decoded.email,
        role_id: decoded.role_id,
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: newAccessToken,
        },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Error refreshing token',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
