import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, year } = body;

    if (!month || !year) {
      return NextResponse.json({ error: 'Vui lòng cung cấp tháng và năm' }, { status: 400 });
    }

    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    // Lấy toàn bộ lịch lặp cố định
    const schedules = await (sql as any).query(`
      SELECT student_name, day_of_week, fee::float as fee, notes
      FROM recurring_schedules
    `, []);

    if (schedules.length === 0) {
      return NextResponse.json({
        message: 'Chưa có cài đặt lịch tự động nào.',
        createdCount: 0,
      });
    }

    // Tính số ngày trong tháng
    const daysInMonth = new Date(y, m, 0).getDate();
    let createdCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      // JS getDay(): 0: CN, 1: T2, 2: T3, 3: T4, 4: T5, 5: T6, 6: T7
      const dateObj = new Date(y, m - 1, day);
      const currentDayOfWeek = dateObj.getDay();

      const formattedMonth = m < 10 ? `0${m}` : `${m}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `${y}-${formattedMonth}-${formattedDay}`;

      // Tìm những schedule khớp với thứ này
      const matchedSchedules = schedules.filter((s: any) => s.day_of_week === currentDayOfWeek);

      for (const sched of matchedSchedules) {
        // Kiểm tra xem buổi học của học sinh này vào ngày này đã tồn tại chưa (tránh trùng)
        const existing = await (sql as any).query(`
          SELECT id FROM tutoring_sessions
          WHERE student_name = $1 AND session_date = $2
          LIMIT 1
        `, [sched.student_name, dateStr]);

        if (existing.length === 0) {
          // Thêm mới
          await (sql as any).query(`
            INSERT INTO tutoring_sessions (student_name, session_date, fee, notes, is_paid)
            VALUES ($1, $2, $3, $4, false)
          `, [sched.student_name, dateStr, sched.fee, sched.notes]);
          createdCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      createdCount,
      message: `Đã tự động tạo ${createdCount} buổi dạy cho Tháng ${m}/${y}!`,
    });
  } catch (err: any) {
    console.error('Error generating sessions:', err);
    return NextResponse.json({ error: err.message || 'Lỗi khi tạo lịch tự động' }, { status: 500 });
  }
}
