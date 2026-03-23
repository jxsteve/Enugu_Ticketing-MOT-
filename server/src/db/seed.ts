import bcrypt from 'bcryptjs';
import { pool, query } from '../config/database';

async function seed(): Promise<void> {
  console.log('Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 12);

  await query(
    `INSERT INTO users (name, email, phone, role, agent_id, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO NOTHING`,
    ['System Admin', 'admin@enugumot.gov.ng', '+2348000000000', 'Admin', 'ADM-001', passwordHash]
  );
  console.log('  [done] Admin user seeded');

  // Zones are seeded in migration 002, but ensure they exist
  const zoneResult = await query('SELECT COUNT(*) as count FROM zones');
  console.log(`  [info] ${zoneResult.rows[0].count} zones in database`);

  // Offences are seeded in migration 004, but ensure they exist
  const offenceResult = await query('SELECT COUNT(*) as count FROM offences');
  console.log(`  [info] ${offenceResult.rows[0].count} offences in database`);

  console.log('Seeding complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
