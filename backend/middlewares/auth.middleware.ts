import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt.utils';
import { JwtPayload } from '../types/dtos';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  /**
   * Verify JWT token and attach user to request
   */
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'No authorization header provided',
        });
        return;
      }

      // Check if it's a Bearer token
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
          success: false,
          message: 'Invalid authorization header format. Use: Bearer <token>',
        });
        return;
      }

      const token = parts[1];

      // Verify token
      const decoded = JwtUtils.verifyToken(token);

      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
        return;
      }

      // Attach user to request
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Optional authentication - doesn't fail if no token
   */
  static optionalAuth(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const token = parts[1];
          const decoded = JwtUtils.verifyToken(token);
          if (decoded) {
            req.user = decoded;
          }
        }
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  }
}
