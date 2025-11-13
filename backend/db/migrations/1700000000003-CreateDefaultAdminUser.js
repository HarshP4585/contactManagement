const bcrypt = require('bcrypt');

class CreateDefaultAdminUser1700000000003 {
  async up(queryRunner) {
    // Hash the default admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin user already exists
    const existingAdmin = await queryRunner.query(`
      SELECT id FROM "user" WHERE email = 'admin@admin.com'
    `);

    // Only create if doesn't exist
    if (existingAdmin.length === 0) {
      await queryRunner.query(`
        INSERT INTO "user" (first_name, last_name, email, password, role_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['Admin', 'User', 'admin@admin.com', hashedPassword, 1, true]);

      console.log('✅ Default admin user created:');
      console.log('   Email: admin@admin.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Default admin user already exists, skipping creation.');
    }
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DELETE FROM "user" WHERE email = 'admin@admin.com'
    `);
  }
}

module.exports = { CreateDefaultAdminUser1700000000003 };
