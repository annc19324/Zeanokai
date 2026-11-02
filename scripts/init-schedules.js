const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_QHDLurXb21te@ep-hidden-art-aoaogril-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function initSchedulesTable() {
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS recurring_schedules (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        day_of_week INT NOT NULL, -- 0: Chủ Nhật, 1: Thứ Hai, 2: Thứ Ba, ..., 6: Thứ Bảy
        fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table recurring_schedules is ready!');
  } catch (err) {
    console.error('Error creating recurring_schedules:', err);
  }
}

initSchedulesTable();
