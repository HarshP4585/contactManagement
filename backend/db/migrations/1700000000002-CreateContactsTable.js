class CreateContactsTable1700000000002 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contacts" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "photo" TEXT,
        "user_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_contacts_user" FOREIGN KEY ("user_id")
          REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Create index on user_id for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_contacts_user_id" ON "contacts"("user_id");
    `);

    // Create index on email
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_contacts_email" ON "contacts"("email");
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_contacts_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_contacts_user_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contacts" CASCADE;`);
  }
}

module.exports = { CreateContactsTable1700000000002 };
