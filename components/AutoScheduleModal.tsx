'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Zap, Clock, CheckCircle } from 'lucide-react';
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
  { id: 1, label: 'Thứ 2' },
  { id: 2, label: 'Thứ 3' },
  { id: 3, label: 'Thứ 4' },
  { id: 4, label: 'Thứ 5' },
  { id: 5, label: 'Thứ 6' },
  { id: 6, label: 'Thứ 7' },
  { id: 0, label: 'CN' },
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
  const [fee, setFee] = useState<number>(0);
  const [feeInput, setFeeInput] = useState('');
  const [notes, setNotes] = useState('');

  const [targetMonth, setTargetMonth] = useState(currentMonth || '11');
  const [targetYear, setTargetYear] = useState(currentYear || '2026');

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      if (data.schedules) setSchedules(data.schedules);
    } catch (e) {
      console.error(e);
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
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleFeeChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    setFeeInput(raw);
    setFee(raw ? parseInt(raw, 10) : 0);
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return alert('Vui lòng nhập tên');
    if (selectedDays.length === 0) return alert('Chọn ít nhất 1 thứ trong tuần');

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
        setMessage('Đã lưu lịch cố định!');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      const res = await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
      if (res.ok) await fetchSchedules();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateSessions = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const res = await fetch('/api/schedules/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: targetMonth, year: targetYear }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || `Đã tạo các buổi dạy cho Tháng ${targetMonth}/${targetYear}!`);
        onSessionsGenerated();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const getDayLabel = (d: number) => {
    const item = DAYS_OF_WEEK.find((x) => x.id === d);
    return item ? item.label : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Cài Đặt Lịch Tự Động
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thông báo nhanh nếu có */}
        {message && (
          <div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 font-medium">
            {message}
          </div>
        )}

        {/* Body 2 Cột hiển thị toàn bộ không cần cuộn */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CỘT 1: CHỨC NĂNG 1 - LỊCH CỐ ĐỊNH (Tự động cập nhật khi đến ngày) */}
          <div className="space-y-3 border-r-0 md:border-r border-slate-200 md:pr-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Lịch Cố Định (Tự động cập nhật khi đến ngày)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Cài thứ học cho từng học sinh. Cứ đến ngày đã hẹn, hệ thống sẽ tự động thêm buổi học vào danh sách.
            </p>

            <form onSubmit={handleAddSchedule} className="space-y-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tên</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">HP/buổi</label>
                  <input
                    type="text"
                    value={feeInput}
                    onChange={(e) => handleFeeChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-bold"
                  />
                </div>
              </div>

              {/* Các thứ trong tuần */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thứ học trong tuần</label>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAYS_OF_WEEK.map((d) => {
                    const sel = selectedDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={`py-1 rounded font-medium text-[11px] border transition-colors ${
                          sel
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Ghi chú</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs"
                >
                  + Lưu lịch cố định
                </button>
              </div>
            </form>

            {/* Danh sách các lịch đang có (tối đa 4 dòng hiển thị gọn) */}
            <div className="max-h-36 overflow-y-auto space-y-1">
              <span className="font-semibold text-slate-600 text-[11px]">Đang cài đặt ({schedules.length}):</span>
              {schedules.length === 0 ? (
                <p className="text-slate-400 text-[11px] italic">Chưa có lịch cố định nào.</p>
              ) : (
                schedules.map((s) => (
                  <div key={s.id} className="p-1.5 bg-white border border-slate-200 rounded flex items-center justify-between text-[11px]">
                    <div className="truncate">
                      <strong className="text-slate-900">{s.student_name}</strong> - 
                      <span className="text-blue-600 font-semibold mx-1">{getDayLabel(s.day_of_week)}</span>
                      ({formatVND(s.fee)})
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(s.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CỘT 2: CHỨC NĂNG 2 - TẠO LỊCH CẢ THÁNG (Hàng loạt) */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>2. Tạo Lịch Cả Tháng (Tạo hàng loạt)</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">
                Tự động điền trước toàn bộ các buổi dạy của cả tháng theo danh sách lịch cố định ở Cột 1.
              </p>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tháng</label>
                    <select
                      value={targetMonth}
                      onChange={(e) => setTargetMonth(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m.toString()}>Tháng {m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Năm</label>
                    <select
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
                    >
                      {[2024, 2025, 2026, 2027].map((y) => (
                        <option key={y} value={y.toString()}>Năm {y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={generating || schedules.length === 0}
                  onClick={handleGenerateSessions}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{generating ? 'Đang tạo...' : `Tạo toàn bộ buổi dạy cho Tháng ${targetMonth}/${targetYear}`}</span>
                </button>
              </div>

              <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
                <p className="flex items-center gap-1 font-semibold text-slate-700">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Cơ chế bảo vệ:</span>
                </p>
                <p>• Những buổi đã tồn tại sẽ không bao giờ bị tạo trùng.</p>
                <p>• Có thể bấm nút ✏️ Sửa hoặc 🗑️ Xoá từng buổi trên bảng bất kỳ lúc nào.</p>
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
