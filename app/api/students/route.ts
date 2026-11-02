import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`
      SELECT DISTINCT student_name
      FROM tutoring_sessions
      WHERE student_name IS NOT NULL AND student_name != ''
      ORDER BY student_name ASC
    `;

    const students = rows.map((r: any) => r.student_name);
    return NextResponse.json({ students });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ students: [] });
  }
}
