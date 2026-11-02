import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      UPDATE tutoring_sessions
      SET 
        student_name = ${student_name.trim()},
        session_date = ${session_date},
        start_time = ${start_time || null},
        end_time = ${end_time || null},
        fee = ${parsedFee},
        notes = ${notes ? notes.trim() : null},
        is_paid = ${paid},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id, 10)}
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

    if (result.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy buổi học' }, { status: 404 });
    }

    return NextResponse.json({ session: result[0] });
  } catch (error: any) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi cập nhật buổi học' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_paid } = body;

    const result = await sql`
      UPDATE tutoring_sessions
      SET 
        is_paid = ${Boolean(is_paid)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id, 10)}
      RETURNING 
        id, 
        student_name, 
        TO_CHAR(session_date, 'YYYY-MM-DD') as session_date,
        is_paid
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy buổi học' }, { status: 404 });
    }

    return NextResponse.json({ session: result[0] });
  } catch (error: any) {
    console.error('Error toggling payment status:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi đổi trạng thái' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM tutoring_sessions
      WHERE id = ${parseInt(id, 10)}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy buổi học' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: result[0].id });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi xoá buổi học' }, { status: 500 });
  }
}
