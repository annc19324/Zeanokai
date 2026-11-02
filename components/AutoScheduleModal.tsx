'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, Zap, User, Clock, Check } from 'lucide-react';
import { RecurringSchedule } from '@/lib/types';
import { formatVND } from '@/lib/utils';

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  currentYear: string;
  onSessionsGenerated: () => void;
  studentList: string[];
}

const DAYS_OF_WEEK = [
  { id: 1, label: 'Thứ Hai' },
  { id: 2, label: 'Thứ Ba' },
  { id: 3, label: 'Thứ Tư' },
  { id: 4, label: 'Thứ Năm' },
  { id: 5, label: 'Thứ Sáu' },
  { id: 6, label: 'Thứ Bảy' },
  { id: 0, label: 'Chủ Nhật' },
];

export default function AutoScheduleModal({
  isOpen,
  onClose,
  currentMonth,
  currentYear,
  onSessionsGenerated,
  studentList,
}: AutoScheduleModalProps) {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [studentName, setStudentName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [fee, setFee] = useState<number>(200000);
  const [feeInput, setFeeInput] = useState('200000');
  const [notes, setNotes] = useState('');

  const [targetMonth, setTargetMonth] = useState(currentMonth || '11');
  const [targetYear, setTargetYear] = useState(currentYear || '2026');

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Tải danh sách lịch cố định
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      if (data.schedules) {
        setSchedules(data.schedules);
      }
    } catch (e) {
      console.error('Lỗi khi tải lịch:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSchedules();
      if (currentMonth && currentMonth !== 'all') setTargetMonth(currentMonth);
      if (currentYear && currentYear !== 'all') setTargetYear(currentYear);
      setMessage('');
    }
  }, [isOpen, currentMonth, currentYear]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleFeeChange = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, '');
    setFeeInput(rawNumber);
    setFee(rawNumber ? parseInt(rawNumber, 10) : 0);
  };

  // Lưu lịch lặp cố định
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập tên người học');
      return;
    }
    if (selectedDays.length === 0) {
      alert('Vui lòng chọn ít nhất một thứ trong tuần');
      return;
    }

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName.trim(),
          days_of_week: selectedDays,
          fee: fee,
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        setStudentName('');
        setSelectedDays([]);
        setNotes('');
        await fetchSchedules();
        setMessage('Đã thêm lịch cố định thành công!');
      } else {
        const err = await res.json();
        alert(err.error || 'Lỗi khi thêm lịch');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thêm');
    }
  };

  // Xóa lịch lặp
  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa cài đặt lịch này?')) return;
    try {
      const res = await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSchedules();
      }
    } catch (e) {
      console.error('Lỗi khi xóa:', e);
    }
  };

  // Kích hoạt tự động tạo các buổi dạy cho tháng
  const handleGenerateSessions = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const res = await fetch('/api/schedules/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: targetMonth,
          year: targetYear,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || `Đã tự động tạo các buổi học cho Tháng ${targetMonth}/${targetYear}!`);
        onSessionsGenerated();
      } else {
        alert(data.error || 'Lỗi khi tạo buổi học tự động');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối');
    } finally {
      setGenerating(false);
    }
  };

  const getDayName = (dayNum: number) => {
    const d = DAYS_OF_WEEK.find((item) => item.id === dayNum);
    return d ? d.label : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Cài Đặt Lịch Tự Động Hàng Tuần</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cài thứ học cố định hàng tuần và tự động tạo các buổi dạy cho cả tháng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm">
          {message && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {message}
            </div>
          )}

          {/* Form thêm quy tắc tự động */}
          <form onSubmit={handleAddSchedule} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Thêm lịch học cố định mới:
            </h4>

            {/* Tên */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên người học *
              </label>
              <input
                type="text"
                placeholder="VD: Em Tuấn, Lớp 10A..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {studentList.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-slate-400 self-center">Chọn nhanh:</span>
                  {studentList.slice(0, 4).map((stu) => (
                    <button
                      key={stu}
                      type="button"
                      onClick={() => setStudentName(stu)}
                      className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700"
                    >
                      {stu}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chọn các thứ trong tuần */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Học vào những ngày nào trong tuần? *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? `✓ ${day.label}` : day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Số tiền 1 buổi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số tiền 1 buổi ({formatVND(fee)})
                </label>
                <input
                  type="text"
                  value={feeInput}
                  onChange={(e) => handleFeeChange(e.target.value)}
                  placeholder="200000"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú mặc định
                </label>
                <input
                  type="text"
                  placeholder="VD: Dạy Toán, 18h - 19h30..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="text-right pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
              >
                + Lưu lịch cố định
              </button>
            </div>
          </form>

          {/* Danh sách lịch cố định đang có */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Các lịch cố định đang hoạt động ({schedules.length}):
            </h4>

            {loading ? (
              <p className="text-xs text-slate-400">Đang tải...</p>
            ) : schedules.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                Chưa có lịch cố định nào. Hãy thêm ở khung bên trên!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {schedules.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.student_name}</span>
                        <span className="px-2 py-0.5 rounded font-semibold bg-blue-100 text-blue-700">
                          {getDayName(item.day_of_week)}
                        </span>
                        <span className="font-bold text-emerald-600">{formatVND(item.fee)}</span>
                      </div>
                      {item.notes && <p className="text-[11px] text-slate-500 mt-0.5">{item.notes}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Xóa lịch này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Nút tự động tạo các buổi dạy cho tháng */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>3. Tự động tạo các buổi dạy cho cả tháng:</span>
            </h4>
            <p className="text-xs text-slate-600">
              Hệ thống sẽ dựa vào các thứ đã cài đặt ở trên để tự động điền các buổi dạy vào tháng bạn chọn. Các buổi đã có sẵn sẽ không bị trùng lặp.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span>Tháng:</span>
                <select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m.toString()}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span>Năm:</span>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y.toString()}>
                      Năm {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={generating || schedules.length === 0}
                onClick={handleGenerateSessions}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>{generating ? 'Đang tạo...' : `Tạo tự động cho Tháng ${targetMonth}/${targetYear}`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
