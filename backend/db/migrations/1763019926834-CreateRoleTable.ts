import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1763019926834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "role" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(50) NOT NULL UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Insert default roles
    await queryRunner.query(`
      INSERT INTO "role" ("name") VALUES
      ('admin'),
      ('user')
      ON CONFLICT ("name") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "role" CASCADE;`);
  }
}
