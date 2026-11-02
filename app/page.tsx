'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import SummaryCards from '@/components/SummaryCards';
import SessionTable from '@/components/SessionTable';
import SessionCards from '@/components/SessionCards';
import SessionModal from '@/components/SessionModal';
import PrintReportModal from '@/components/PrintReportModal';
import { TutoringSession, SessionFilter, SummaryStats } from '@/lib/types';
import { getPreviousMonthInfo, formatFullDateVN, formatVND } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [filter, setFilter] = useState<SessionFilter>({
    month: '',
    year: '',
    student: 'all',
    status: 'all',
    search: '',
  });

  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [stats, setStats] = useState<SummaryStats>({
    totalSessions: 0,
    totalFee: 0,
    paidFee: 0,
    unpaidFee: 0,
    studentBreakdown: [],
  });

  const [studentList, setStudentList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  // Giao diện
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TutoringSession | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Khởi tạo trên Client: set tháng trước mặc định theo yêu cầu người dùng
  useEffect(() => {
    const defaultMonthInfo = getPreviousMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: defaultMonthInfo.month,
      year: defaultMonthInfo.year,
    }));
    setIsClientReady(true);

    const savedTheme = localStorage.getItem('zeanokai-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    if (window.innerWidth < 768) {
      setViewMode('cards');
    }
  }, []);

  // Thay đổi theme
  const toggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zeanokai-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zeanokai-theme', 'light');
    }
  };

  // Tải danh sách học sinh để autocomplete
  const fetchStudentList = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.students) {
        setStudentList(data.students);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách học sinh:', e);
    }
  };

  // Tải danh sách buổi học theo bộ lọc
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.month) params.set('month', filter.month);
      if (filter.year) params.set('year', filter.year);
      if (filter.student) params.set('student', filter.student);
      if (filter.status) params.set('status', filter.status);
      if (filter.search) params.set('search', filter.search);

      const res = await fetch(`/api/sessions?${params.toString()}`);
      const data = await res.json();

      if (data.sessions) {
        setSessions(data.sessions);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu buổi dạy:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStudentList();
  }, []);

  useEffect(() => {
    if (isClientReady) {
      fetchSessions();
    }
  }, [fetchSessions, isClientReady]);

  // Thêm / Sửa buổi học
  const handleSaveSession = async (
    sessionData: Partial<TutoringSession>,
    keepOpen = false
  ): Promise<boolean> => {
    try {
      if (sessionData.id) {
        // Cập nhật
        const res = await fetch(`/api/sessions/${sessionData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Cập nhật thất bại');
        }
      } else {
        // Thêm mới
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Thêm thất bại');
        }
      }

      await fetchSessions();
      await fetchStudentList();
      return true;
    } catch (error: any) {
      alert(error.message || 'Lỗi khi lưu dữ liệu');
      return false;
    }
  };

  // Đổi trạng thái thanh toán nhanh
  const handleTogglePaid = async (id: number, currentStatus: boolean) => {
    try {
      // Optimistic update
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_paid: !currentStatus } : s))
      );

      const res = await fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_paid: !currentStatus }),
      });

      if (!res.ok) {
        await fetchSessions(); // rollback
      } else {
        fetchSessions(); // refresh stats
      }
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái thanh toán:', err);
      await fetchSessions();
    }
  };

  // Xoá buổi học
  const handleDeleteSession = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá buổi học này không?')) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSessions();
        fetchStudentList();
      } else {
        alert('Xoá buổi học không thành công');
      }
    } catch (err) {
      console.error('Lỗi khi xoá buổi học:', err);
    }
  };

  // Mở modal sửa
  const handleEdit = (session: TutoringSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  // Nhân bản buổi học (duplicate)
  const handleDuplicate = (session: TutoringSession) => {
    // Nhân bản với ngày hôm nay hoặc giữ nguyên ngày, tạo bản sao mới
    setEditingSession({
      ...session,
      id: 0, // id 0 để coi như thêm mới
    });
    setIsModalOpen(true);
  };

  // Xuất file CSV (Hỗ trợ tiếng Việt UTF-8 có BOM mở trong Excel không bị lỗi font)
  const handleExportCSV = () => {
    if (sessions.length === 0) {
      alert('Không có dữ liệu buổi học nào để xuất!');
      return;
    }

    const headers = [
      'STT',
      'Tên học sinh / Môn học',
      'Thứ ngày tháng năm',
      'Giờ bắt đầu',
      'Giờ kết thúc',
      'Số tiền 1 buổi (VNĐ)',
      'Ghi chú',
      'Trạng thái thanh toán',
    ];

    const rows = sessions.map((item, index) => [
      index + 1,
      `"${item.student_name.replace(/"/g, '""')}"`,
      `"${formatFullDateVN(item.session_date)}"`,
      `"${item.start_time || ''}"`,
      `"${item.end_time || ''}"`,
      item.fee,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      item.is_paid ? '"Đã thanh toán"' : '"Chưa thanh toán"',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Zeanokai_GiaSu_${filter.month !== 'all' ? `Thang_${filter.month}_${filter.year}` : 'TatCa'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Nhãn bộ lọc hiện tại
  const currentFilterLabel =
    filter.month === 'all'
      ? 'Tất cả các tháng'
      : `Tháng ${filter.month}/${filter.year}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b101b] transition-colors">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => {
          setEditingSession(null);
          setIsModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Bộ lọc đa năng (Mặc định tháng trước) */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          studentList={studentList}
          totalFilteredCount={sessions.length}
        />

        {/* Các thẻ tổng kết (Tổng số buổi, Tổng tiền, Đã thu, Chưa thu) */}
        <SummaryCards stats={stats} currentFilterLabel={currentFilterLabel} />

        {/* Danh sách các buổi dạy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Danh sách các buổi dạy</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {currentFilterLabel}
              </span>
            </h2>

            {/* Mobile view toggle */}
            <div className="md:hidden flex items-center gap-2 text-xs">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {viewMode === 'table' ? 'Xem dạng Thẻ' : 'Xem dạng Bảng'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm">Đang tải dữ liệu từ Neon DB...</p>
            </div>
          ) : viewMode === 'table' ? (
            <SessionTable
              sessions={sessions}
              onEdit={handleEdit}
              onDelete={handleDeleteSession}
              onDuplicate={handleDuplicate}
              onTogglePaid={handleTogglePaid}
            />
          ) : (
            <SessionCards
              sessions={sessions}
              onEdit={handleEdit}
              onDelete={handleDeleteSession}
              onDuplicate={handleDuplicate}
              onTogglePaid={handleTogglePaid}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 no-print">
        <p>
          <strong>Zeanokai</strong> &copy; {new Date().getFullYear()} - Ứng dụng quản lý lịch dạy & tính học phí gia sư
        </p>
      </footer>

      {/* Modal Thêm / Sửa Buổi Dạy */}
      <SessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        editingSession={editingSession}
        studentList={studentList}
      />

      {/* Modal In Phiếu Báo Học Phí */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        sessions={sessions}
        stats={stats}
        currentFilterLabel={currentFilterLabel}
      />
    </div>
  );
}
