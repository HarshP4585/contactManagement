class CreateRoleTable1700000000000 {
  async up(queryRunner) {
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

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "role" CASCADE;`);
  }
}

module.exports = { CreateRoleTable1700000000000 };
