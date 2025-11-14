import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateDefaultAdminUser1763019929000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash the default admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin user already exists
    const existingAdmin = await queryRunner.query(`
      SELECT id FROM "user" WHERE email = 'admin@admin.com'
    `);

    // Only create if doesn't exist
    if (existingAdmin.length === 0) {
      await queryRunner.query(
        `
        INSERT INTO "user" (first_name, last_name, email, password, role_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        ['Admin', 'User', 'admin@admin.com', hashedPassword, 1, true]
      );

    } else {
      console.log('ℹ️  Default admin user already exists, skipping creation.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "user" WHERE email = 'admin@admin.com'
    `);
  }
}
