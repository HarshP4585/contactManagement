import { AppDataSource } from '../db/data-source';
import { User } from '../types/entities';
import { RegisterDto } from '../types/dtos';
import * as bcrypt from 'bcrypt';

export class AuthUtils {
  /**
   * Create a new user with hashed password
   */
  static async createUser(userData: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const roleId = userData.role_id || 2; // Default to 'user' role

    const query = `
      INSERT INTO "user" (first_name, last_name, email, password, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, role_id, is_active, created_at, updated_at
    `;

    const result = await AppDataSource.query(query, [
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      roleId,
    ]);

    return result[0];
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, first_name, last_name, email, password, role_id, is_active, created_at, updated_at
      FROM "user"
      WHERE email = $1 AND is_active = true
    `;

    const result = await AppDataSource.query(query, [email]);
    return result[0] || null;
  }

  /**
   * Find user by ID (without password)
   */
  static async findUserById(userId: number): Promise<Omit<User, 'password'> | null> {
    const query = `
      SELECT id, first_name, last_name, email, role_id, is_active, created_at, updated_at
      FROM "user"
      WHERE id = $1 AND is_active = true
    `;

    const result = await AppDataSource.query(query, [userId]);
    return result[0] || null;
  }

  /**
   * Check if email already exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM "user"
      WHERE email = $1
    `;

    const result = await AppDataSource.query(query, [email]);
    return parseInt(result[0].count) > 0;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get user with role name
   */
  static async getUserWithRole(userId: number): Promise<any> {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.role_id, u.is_active,
             u.created_at, u.updated_at, r.name as role_name
      FROM "user" u
      INNER JOIN "role" r ON u.role_id = r.id
      WHERE u.id = $1 AND u.is_active = true
    `;

    const result = await AppDataSource.query(query, [userId]);
    return result[0] || null;
  }
}
