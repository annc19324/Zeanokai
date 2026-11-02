export interface TutoringSession {
  id: number;
  student_name: string;
  session_date: string; // YYYY-MM-DD
  fee: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RecurringSchedule {
  id: number;
  student_name: string;
  day_of_week: number; // 0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy
  fee: number;
  notes?: string | null;
  created_at?: string;
}

export interface SessionFilter {
  month: string; // 'all' or '1'..'12'
  year: string;  // 'all' or '2024', '2025', '2026', ...
  student: string; // 'all' or specific student name
  status?: string;
  search: string;
}
