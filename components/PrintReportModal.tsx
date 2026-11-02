'use client';

import React, { useState } from 'react';
import { X, Printer, FileDown } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Ẩn khi in) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between no-print bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Phiếu Tổng Kết ({currentFilterLabel})
            </h3>
            {/* Chọn học sinh nếu có nhiều học sinh */}
            {students.length > 1 && (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
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

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              title="In trực tiếp hoặc chọn Lưu dưới dạng PDF"
            >
              <Printer className="w-4 h-4" />
              <span>In phiếu / Xuất file PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung nội dung in phiếu */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
          {/* Tiêu đề phiếu */}
          <div className="text-center border-b pb-4 border-slate-300">
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
              PHIẾU TỔNG KẾT BUỔI DẠY GIA SƯ
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              Zeanokai • Kỳ: {currentFilterLabel}
            </p>
            {selectedStudent !== 'all' && (
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                Học sinh: {selectedStudent}
              </p>
            )}
          </div>

          {/* Bảng chi tiết các buổi dạy */}
          <div className="mt-6">
            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-800">
                  <th className="py-2 px-3 w-10 text-center border-r border-slate-300">STT</th>
                  {selectedStudent === 'all' && (
                    <th className="py-2 px-3 border-r border-slate-300">Tên</th>
                  )}
                  <th className="py-2 px-3 border-r border-slate-300">Thứ ngày tháng năm</th>
                  <th className="py-2 px-3 border-r border-slate-300">Số tiền 1 buổi</th>
                  <th className="py-2 px-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {filteredSessions.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">
                      {idx + 1}
                    </td>
                    {selectedStudent === 'all' && (
                      <td className="py-2 px-3 font-semibold border-r border-slate-300">
                        {item.student_name}
                      </td>
                    )}
                    <td className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">
                      {formatFullDateVN(item.session_date)}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-300 whitespace-nowrap">
                      {formatVND(item.fee)}
                    </td>
                    <td className="py-2 px-3 text-slate-700 max-w-xs">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-400 bg-slate-100 font-bold text-slate-900 text-sm">
                  <td colSpan={selectedStudent === 'all' ? 3 : 2} className="py-2.5 px-3 text-right uppercase border-r border-slate-300">
                    Tổng cộng: {filteredSessions.length} buổi
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-left font-extrabold text-blue-700">
                    {formatVND(totalFee)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Chữ ký & Ngày xác nhận */}
          <div className="mt-8 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p className="italic">Xin cảm ơn Quý phụ huynh & học sinh!</p>
            </div>
            <div className="text-center w-48">
              <p className="italic">Ngày ..... tháng ..... năm 20....</p>
              <p className="font-bold mt-1 text-slate-800">Người lập phiếu</p>
              <div className="h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
