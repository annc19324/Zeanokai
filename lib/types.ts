export interface TutoringSession {
  id: number;
  student_name: string;
  session_date: string; // YYYY-MM-DD
  start_time?: string | null;
  end_time?: string | null;
  fee: number;
  notes?: string | null;
  is_paid: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SessionFilter {
  month: string; // 'all' or '1'..'12'
  year: string;  // 'all' or '2024', '2025', '2026', ...
  student: string; // 'all' or specific student name
  status: 'all' | 'paid' | 'unpaid';
  search: string;
}

export interface SummaryStats {
  totalSessions: number;
  totalFee: number;
  paidFee: number;
  unpaidFee: number;
  studentBreakdown: {
    student_name: string;
    sessions_count: number;
    total_fee: number;
    paid_fee: number;
    unpaid_fee: number;
  }[];
}
