'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText, User } from 'lucide-react';
import { TutoringSession } from '@/lib/types';
import { getDayOfWeekVN, formatVND } from '@/lib/utils';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: Partial<TutoringSession>) => Promise<boolean>;
  editingSession: TutoringSession | null;
  studentList: string[];
}

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  editingSession,
  studentList,
}: SessionModalProps) {
  const [studentName, setStudentName] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [fee, setFee] = useState<number>(200000);
  const [feeInput, setFeeInput] = useState('200000');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingSession) {
      setStudentName(editingSession.student_name);
      setSessionDate(editingSession.session_date);
      const f = editingSession.fee || 0;
      setFee(f);
      setFeeInput(f.toString());
      setNotes(editingSession.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setSessionDate(today);
      setFee(200000);
      setFeeInput('200000');
      setNotes('');
    }
    setErrorMessage('');
  }, [editingSession, isOpen]);

  if (!isOpen) return null;

  const dayOfWeek = sessionDate ? getDayOfWeekVN(sessionDate) : '';

  const handleFeeChange = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, '');
    setFeeInput(rawNumber);
    setFee(rawNumber ? parseInt(rawNumber, 10) : 0);
  };

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      setErrorMessage('Vui lòng nhập tên');
      return;
    }
    if (!sessionDate) {
      setErrorMessage('Vui lòng chọn ngày học');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const success = await onSave({
        id: editingSession?.id,
        student_name: studentName.trim(),
        session_date: sessionDate,
        fee: fee,
        notes: notes.trim() || null,
      });

      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã xảy ra lỗi khi lưu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {editingSession ? 'Sửa thông tin buổi dạy' : 'Thêm buổi dạy mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-sm">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Tên */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Tên *</span>
            </label>
            <input
              type="text"
              placeholder="VD: Em Tuấn, Lớp 10A..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {studentList.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {studentList.slice(0, 4).map((stu) => (
                  <button
                    key={stu}
                    type="button"
                    onClick={() => setStudentName(stu)}
                    className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {stu}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thứ ngày tháng năm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Ngày *</span>
              </span>
              {dayOfWeek && (
                <span className="text-xs font-bold text-blue-600">
                  {dayOfWeek}
                </span>
              )}
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Số tiền 1 buổi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                <span>HP/buổi</span>
              </label>
              <span className="text-xs font-bold text-blue-600">
                {formatVND(fee)}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={feeInput}
                onChange={(e) => handleFeeChange(e.target.value)}
                placeholder="200000"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                VNĐ
              </span>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Ghi chú</span>
            </label>
            <textarea
              rows={2}
              placeholder="Nội dung bài học, bài tập..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>
    </div>
  );
}
