'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Clock, FileText, User, Check, Sparkles } from 'lucide-react';
import { TutoringSession } from '@/lib/types';
import { getDayOfWeekVN, formatVND } from '@/lib/utils';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: Partial<TutoringSession>, keepOpen?: boolean) => Promise<boolean>;
  editingSession: TutoringSession | null;
  studentList: string[];
}

const COMMON_FEES = [150000, 200000, 250000, 300000, 350000, 400000, 500000];

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  editingSession,
  studentList,
}: SessionModalProps) {
  const [studentName, setStudentName] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [fee, setFee] = useState<number>(200000);
  const [feeInput, setFeeInput] = useState('200000');
  const [notes, setNotes] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Khi mở modal hoặc đổi editingSession
  useEffect(() => {
    if (editingSession) {
      setStudentName(editingSession.student_name);
      setSessionDate(editingSession.session_date);
      setStartTime(editingSession.start_time || '');
      setEndTime(editingSession.end_time || '');
      const f = editingSession.fee || 0;
      setFee(f);
      setFeeInput(f.toString());
      setNotes(editingSession.notes || '');
      setIsPaid(editingSession.is_paid);
    } else {
      // Mặc định ngày hôm nay
      const today = new Date().toISOString().split('T')[0];
      setSessionDate(today);
      setFee(200000);
      setFeeInput('200000');
      setStartTime('');
      setEndTime('');
      setNotes('');
      setIsPaid(false);
    }
    setErrorMessage('');
  }, [editingSession, isOpen]);

  if (!isOpen) return null;

  // Tính thứ trong tuần cho ngày đang chọn
  const dayOfWeek = sessionDate ? getDayOfWeekVN(sessionDate) : '';

  const handleFeeChange = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, '');
    setFeeInput(rawNumber);
    setFee(rawNumber ? parseInt(rawNumber, 10) : 0);
  };

  const handleSelectQuickFee = (amount: number) => {
    setFee(amount);
    setFeeInput(amount.toString());
  };

  const handleSubmit = async (keepOpen = false) => {
    if (!studentName.trim()) {
      setErrorMessage('Vui lòng nhập tên học sinh hoặc môn học');
      return;
    }
    if (!sessionDate) {
      setErrorMessage('Vui lòng chọn ngày học');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const success = await onSave(
        {
          id: editingSession?.id,
          student_name: studentName.trim(),
          session_date: sessionDate,
          start_time: startTime || null,
          end_time: endTime || null,
          fee: fee,
          notes: notes.trim() || null,
          is_paid: isPaid,
        },
        keepOpen
      );

      if (success) {
        if (keepOpen) {
          // Reset form cho buổi tiếp theo
          setNotes('');
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã xảy ra lỗi khi lưu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{editingSession ? 'Sửa thông tin buổi dạy' : 'Thêm buổi dạy mới'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ghi chép số buổi, học phí và nội dung giảng dạy
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-sm">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* 1. Tên học sinh / môn học */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Tên học sinh / Lớp / Môn học *</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Em Tuấn - Toán 10, Gia Khiêm..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            {/* Gợi ý học sinh đã từng dạy */}
            {studentList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 self-center">Gợi ý nhanh:</span>
                {studentList.slice(0, 5).map((stu) => (
                  <button
                    key={stu}
                    type="button"
                    onClick={() => setStudentName(stu)}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-200/50 dark:border-slate-700"
                  >
                    {stu}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Thứ ngày tháng năm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ngày dạy học *</span>
              </span>
              {dayOfWeek && (
                <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {dayOfWeek}
                </span>
              )}
            </label>
            <input
              type="date"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
            />
          </div>

          {/* 3. Khung giờ (tuỳ chọn) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Giờ bắt đầu</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Giờ kết thúc</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* 4. Số tiền 1 buổi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Số tiền 1 buổi</span>
              </label>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {formatVND(fee)}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={feeInput}
                onChange={(e) => handleFeeChange(e.target.value)}
                placeholder="200000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                VNĐ
              </span>
            </div>

            {/* Nút chọn nhanh mức học phí */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_FEES.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleSelectQuickFee(amount)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    fee === amount
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {amount / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* 5. Ghi chú buổi dạy */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Ghi chú buổi dạy</span>
            </label>
            <textarea
              rows={3}
              placeholder="Nội dung bài học, bài tập về nhà, tình hình học tập, học bù..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 placeholder-slate-400 resize-none"
            />
          </div>

          {/* 6. Trạng thái thanh toán */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                  isPaid ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 dark:border-slate-600'
                }`}
                onClick={() => setIsPaid(!isPaid)}
              >
                {isPaid && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <label 
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                onClick={() => setIsPaid(!isPaid)}
              >
                Đã thanh toán buổi học này
              </label>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isPaid ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300' : 'text-amber-700 bg-amber-50 dark:bg-amber-950/80 dark:text-amber-300'}`}>
              {isPaid ? 'Đã nhận tiền' : 'Chưa nhận tiền'}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy
          </button>

          {!editingSession && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-indigo-600/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
            >
              Lưu & thêm tiếp
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/25 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Đang lưu...' : editingSession ? 'Cập nhật buổi học' : 'Lưu buổi học'}
          </button>
        </div>
      </div>
    </div>
  );
}
