import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/dtos';

export class JwtUtils {
  private static readonly secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
  private static readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this-in-production';
  private static readonly accessTokenExpiry = Date.now() + 1 * 3600 * 1000 // 1 hour;
  private static readonly refreshTokenExpiry = Date.now() + 1 * 3600 * 1000 * 24 * 30 // 30 days;

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  /**
   * Verify access token
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token without verification (use with caution)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
