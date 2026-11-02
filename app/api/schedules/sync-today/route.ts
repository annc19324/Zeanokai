import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST() {
  try {
    // Lấy ngày hôm nay theo múi giờ Việt Nam (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
    
    const y = vnTime.getFullYear();
    const m = vnTime.getMonth() + 1;
    const d = vnTime.getDate();
    const dayOfWeek = vnTime.getDay(); // 0: CN, 1: T2, ..., 6: T7

    const formattedMonth = m < 10 ? `0${m}` : `${m}`;
    const formattedDay = d < 10 ? `0${d}` : `${d}`;
    const todayStr = `${y}-${formattedMonth}-${formattedDay}`;

    // Lấy tất cả lịch cố định khớp với thứ hôm nay
    const schedules = await (sql as any).query(`
      SELECT student_name, fee::float as fee, notes
      FROM recurring_schedules
      WHERE day_of_week = $1
    `, [dayOfWeek]);

    let addedCount = 0;

    for (const sched of schedules) {
      // Kiểm tra xem hôm nay học sinh này đã có buổi học chưa
      const existing = await (sql as any).query(`
        SELECT id FROM tutoring_sessions
        WHERE student_name = $1 AND session_date = $2
        LIMIT 1
      `, [sched.student_name, todayStr]);

      if (existing.length === 0) {
        await (sql as any).query(`
          INSERT INTO tutoring_sessions (student_name, session_date, fee, notes, is_paid)
          VALUES ($1, $2, $3, $4, false)
        `, [sched.student_name, todayStr, sched.fee, sched.notes]);
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      todayStr,
      addedCount,
    });
  } catch (err: any) {
    console.error('Error auto syncing today session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
