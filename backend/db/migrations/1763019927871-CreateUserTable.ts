import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1763019927000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(100) NOT NULL,
        "last_name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role_id" INTEGER NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_user_role" FOREIGN KEY ("role_id")
          REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Create index on email for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
    `);

    // Create index on role_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_role_id" ON "user"("role_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_role_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_email";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user" CASCADE;`);
  }
}
