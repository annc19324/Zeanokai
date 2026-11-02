import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await (sql as any).query(`
      SELECT id, student_name, day_of_week, fee::float as fee, notes, created_at
      FROM recurring_schedules
      ORDER BY student_name ASC, day_of_week ASC
    `, []);
    return NextResponse.json({ schedules: rows });
  } catch (err: any) {
    console.error('Error fetching schedules:', err);
    return NextResponse.json({ schedules: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, days_of_week, fee, notes } = body;

    if (!student_name || !days_of_week || !Array.isArray(days_of_week) || days_of_week.length === 0) {
      return NextResponse.json({ error: 'Vui lòng chọn tên và ít nhất một thứ trong tuần' }, { status: 400 });
    }

    const parsedFee = Number(fee) || 0;
    const cleanNotes = notes ? notes.trim() : null;
    const cleanName = student_name.trim();

    // Thêm các ngày lặp
    for (const day of days_of_week) {
      const dayNum = parseInt(day, 10);
      await (sql as any).query(`
        INSERT INTO recurring_schedules (student_name, day_of_week, fee, notes)
        VALUES ($1, $2, $3, $4)
      `, [cleanName, dayNum, parsedFee, cleanNotes]);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating schedule:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi lưu lịch tự động' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });
    }

    await (sql as any).query(`
      DELETE FROM recurring_schedules WHERE id = $1
    `, [parseInt(id, 10)]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting schedule:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi xóa lịch' }, { status: 500 });
  }
}
