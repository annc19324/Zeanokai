import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { TutoringSession } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // e.g. '10' or 'all'
    const year = searchParams.get('year');   // e.g. '2026' or 'all'
    const student = searchParams.get('student');
    const status = searchParams.get('status'); // 'paid', 'unpaid', 'all'
    const search = searchParams.get('search')?.trim();

    // Query builder
    let query = `
      SELECT 
        id, 
        student_name, 
        TO_CHAR(session_date, 'YYYY-MM-DD') as session_date,
        start_time,
        end_time,
        fee::float as fee,
        notes,
        is_paid,
        created_at
      FROM tutoring_sessions
      WHERE 1=1
    `;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (month && month !== 'all') {
      conditions.push(`EXTRACT(MONTH FROM session_date) = $${paramIndex++}`);
      values.push(parseInt(month, 10));
    }

    if (year && year !== 'all') {
      conditions.push(`EXTRACT(YEAR FROM session_date) = $${paramIndex++}`);
      values.push(parseInt(year, 10));
    }

    if (student && student !== 'all') {
      conditions.push(`student_name = $${paramIndex++}`);
      values.push(student);
    }

    if (status === 'paid') {
      conditions.push(`is_paid = true`);
    } else if (status === 'unpaid') {
      conditions.push(`is_paid = false`);
    }

    if (search) {
      conditions.push(`(student_name ILIKE $${paramIndex} OR notes ILIKE $${paramIndex})`);
      paramIndex++;
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY session_date DESC, id DESC';

    // Execute query with raw interpolation for serverless sql
    // Using neon sql template / query parameterization:
    // With @neondatabase/serverless, sql(query, values) or sql.query(query, values) works.
    let rows: any[];
    if (values.length > 0) {
      rows = await (sql as any).query(query, values);
    } else {
      rows = await (sql as any).query(query, []);
    }

    // Tính toán thống kê từ danh sách kết quả
    let totalSessions = rows.length;
    let totalFee = 0;
    let paidFee = 0;
    let unpaidFee = 0;

    const studentMap = new Map<string, { count: number; fee: number; paid: number; unpaid: number }>();

    for (const row of rows) {
      const fee = Number(row.fee) || 0;
      totalFee += fee;
      if (row.is_paid) {
        paidFee += fee;
      } else {
        unpaidFee += fee;
      }

      const sName = row.student_name;
      const cur = studentMap.get(sName) || { count: 0, fee: 0, paid: 0, unpaid: 0 };
      cur.count += 1;
      cur.fee += fee;
      if (row.is_paid) {
        cur.paid += fee;
      } else {
        cur.unpaid += fee;
      }
      studentMap.set(sName, cur);
    }

    const studentBreakdown = Array.from(studentMap.entries()).map(([name, data]) => ({
      student_name: name,
      sessions_count: data.count,
      total_fee: data.fee,
      paid_fee: data.paid,
      unpaid_fee: data.unpaid,
    })).sort((a, b) => b.total_fee - a.total_fee);

    return NextResponse.json({
      sessions: rows as TutoringSession[],
      stats: {
        totalSessions,
        totalFee,
        paidFee,
        unpaidFee,
        studentBreakdown,
      },
    });
  } catch (error: any) {
    console.error('Error fetching tutoring sessions:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tải dữ liệu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, session_date, start_time, end_time, fee, notes, is_paid } = body;

    if (!student_name || !session_date) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp tên học sinh và ngày học' },
        { status: 400 }
      );
    }

    const parsedFee = Number(fee) || 0;
    const paid = Boolean(is_paid);

    const result = await sql`
      INSERT INTO tutoring_sessions (
        student_name,
        session_date,
        start_time,
        end_time,
        fee,
        notes,
        is_paid
      )
      VALUES (
        ${student_name.trim()},
        ${session_date},
        ${start_time || null},
        ${end_time || null},
        ${parsedFee},
        ${notes ? notes.trim() : null},
        ${paid}
      )
      RETURNING 
        id, 
        student_name, 
        TO_CHAR(session_date, 'YYYY-MM-DD') as session_date,
        start_time,
        end_time,
        fee::float as fee,
        notes,
        is_paid,
        created_at
    `;

    return NextResponse.json({ session: result[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tutoring session:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi lưu buổi học' }, { status: 500 });
  }
}
