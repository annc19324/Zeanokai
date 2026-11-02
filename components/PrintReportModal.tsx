'use client';

import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import { TutoringSession } from '@/lib/types';
import { formatFullDateVN, formatVND } from '@/lib/utils';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TutoringSession[];
  currentFilterLabel: string;
}

export default function PrintReportModal({
  isOpen,
  onClose,
  sessions,
  currentFilterLabel,
}: PrintReportModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const students = Array.from(new Set(sessions.map((s) => s.student_name)));

  const filteredSessions = selectedStudent === 'all'
    ? sessions
    : sessions.filter((s) => s.student_name === selectedStudent);

  const totalFee = filteredSessions.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header điều khiển (Ẩn khi in) */}
        <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between no-print bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              In phiếu ({currentFilterLabel})
            </span>
            {students.length > 1 && (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="text-xs px-2 py-1 rounded border border-slate-300 bg-white text-slate-800"
              >
                <option value="all">Tất cả ({filteredSessions.length} buổi)</option>
                {students.map((stu) => (
                  <option key={stu} value={stu}>
                    {stu}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Khung nội dung in phiếu - Gọn gàng không cần cuộn */}
        <div className="p-4 overflow-y-auto max-h-[78vh] bg-white text-slate-900 print:p-0">
          {/* Tiêu đề phiếu: Chỉ cần ghi Tháng Năm */}
          <div className="text-center pb-2 mb-2 border-b border-slate-200">
            <h1 className="text-base font-extrabold uppercase text-slate-900 tracking-wide">
              {currentFilterLabel.toUpperCase()}
            </h1>
            {selectedStudent !== 'all' && (
              <p className="text-xs font-bold text-blue-600">
                {selectedStudent}
              </p>
            )}
          </div>

          {/* Bảng chi tiết */}
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-800">
                <th className="py-1.5 px-2 w-8 text-center border-r border-slate-300">STT</th>
                {selectedStudent === 'all' && (
                  <th className="py-1.5 px-2 border-r border-slate-300">Tên</th>
                )}
                <th className="py-1.5 px-2 border-r border-slate-300">Ngày</th>
                <th className="py-1.5 px-2 border-r border-slate-300">HP/buổi</th>
                <th className="py-1.5 px-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSessions.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-1.5 px-2 text-center border-r border-slate-300 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  {selectedStudent === 'all' && (
                    <td className="py-1.5 px-2 font-medium border-r border-slate-300">
                      {item.student_name}
                    </td>
                  )}
                  <td className="py-1.5 px-2 border-r border-slate-300 whitespace-nowrap">
                    {formatFullDateVN(item.session_date)}
                  </td>
                  <td className="py-1.5 px-2 font-bold text-slate-900 border-r border-slate-300 whitespace-nowrap">
                    {formatVND(item.fee)}
                  </td>
                  <td className="py-1.5 px-2 text-slate-700">
                    {item.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-400 bg-slate-50 font-bold text-slate-900">
                <td colSpan={selectedStudent === 'all' ? 3 : 2} className="py-2 px-2 text-right uppercase border-r border-slate-300">
                  Tổng: {filteredSessions.length} buổi
                </td>
                <td colSpan={2} className="py-2 px-2 text-left font-extrabold text-blue-700 text-sm">
                  {formatVND(totalFee)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
