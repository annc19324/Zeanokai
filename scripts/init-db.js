const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_QHDLurXb21te@ep-hidden-art-aoaogril-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function initDB() {
  try {
    console.log('Connecting to Neon PostgreSQL...');
    const version = await sql`SELECT version()`;
    console.log('PostgreSQL version:', version[0].version);

    console.log('Creating table tutoring_sessions if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS tutoring_sessions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        session_date DATE NOT NULL,
        start_time VARCHAR(10),
        end_time VARCHAR(10),
        fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
        notes TEXT,
        is_paid BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index on session_date and student_name
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_date ON tutoring_sessions(session_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_student ON tutoring_sessions(student_name)`;

    console.log('Table tutoring_sessions is ready!');

    // Check count
    const count = await sql`SELECT count(*) FROM tutoring_sessions`;
    console.log('Current total sessions count:', count[0].count);

  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
}

initDB();
