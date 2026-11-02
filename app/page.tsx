'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import SessionTable from '@/components/SessionTable';
import SessionModal from '@/components/SessionModal';
import PrintReportModal from '@/components/PrintReportModal';
import { TutoringSession, SessionFilter } from '@/lib/types';
import { getPreviousMonthInfo } from '@/lib/utils';
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
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalFee, setTotalFee] = useState(0);

  const [studentList, setStudentList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TutoringSession | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Khởi tạo mặc định là tháng trước tháng hiện tại
  useEffect(() => {
    const defaultMonthInfo = getPreviousMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: defaultMonthInfo.month,
      year: defaultMonthInfo.year,
    }));
    setIsClientReady(true);
  }, []);

  // Tải danh sách tên học sinh để lọc
  const fetchStudentList = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.students) {
        setStudentList(data.students);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách tên:', e);
    }
  };

  // Tải danh sách buổi dạy theo bộ lọc
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.month) params.set('month', filter.month);
      if (filter.year) params.set('year', filter.year);
      if (filter.student) params.set('student', filter.student);
      if (filter.search) params.set('search', filter.search);

      const res = await fetch(`/api/sessions?${params.toString()}`);
      const data = await res.json();

      if (data.sessions) {
        setSessions(data.sessions);
        setTotalSessions(data.stats.totalSessions || 0);
        setTotalFee(data.stats.totalFee || 0);
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

  // Lưu buổi dạy
  const handleSaveSession = async (sessionData: Partial<TutoringSession>): Promise<boolean> => {
    try {
      if (sessionData.id) {
        const res = await fetch(`/api/sessions/${sessionData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });
        if (!res.ok) throw new Error('Cập nhật thất bại');
      } else {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        });
        if (!res.ok) throw new Error('Thêm thất bại');
      }

      await fetchSessions();
      await fetchStudentList();
      return true;
    } catch (error: any) {
      alert(error.message || 'Lỗi khi lưu dữ liệu');
      return false;
    }
  };

  // Xoá buổi dạy
  const handleDeleteSession = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá buổi học này?')) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSessions();
        fetchStudentList();
      }
    } catch (err) {
      console.error('Lỗi xoá:', err);
    }
  };

  const handleEdit = (session: TutoringSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const currentFilterLabel =
    filter.month === 'all'
      ? 'Tất cả các tháng'
      : `Tháng ${filter.month}/${filter.year}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Navbar
        onOpenAddModal={() => {
          setEditingSession(null);
          setIsModalOpen(true);
        }}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Phần lọc */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          studentList={studentList}
        />

        {/* Danh sách các buổi dạy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              Danh sách các buổi dạy ({currentFilterLabel})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
              <p className="text-xs">Đang tải danh sách...</p>
            </div>
          ) : (
            <SessionTable
              sessions={sessions}
              onEdit={handleEdit}
              onDelete={handleDeleteSession}
              totalSessions={totalSessions}
              totalFee={totalFee}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 no-print">
        <p>Zeanokai &copy; {new Date().getFullYear()}</p>
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

      {/* Modal In Phiếu / Xuất PDF */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        sessions={sessions}
        currentFilterLabel={currentFilterLabel}
      />
    </div>
  );
}
