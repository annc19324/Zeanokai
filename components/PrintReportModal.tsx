'use client';

import React, { useState } from 'react';
import { X, Printer, GraduationCap, CheckCircle2 } from 'lucide-react';
import { TutoringSession, SummaryStats } from '@/lib/types';
import { formatFullDateVN, formatVND } from '@/lib/utils';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TutoringSession[];
  stats: SummaryStats;
  currentFilterLabel: string;
}

export default function PrintReportModal({
  isOpen,
  onClose,
  sessions,
  stats,
  currentFilterLabel,
}: PrintReportModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [bankInfo, setBankInfo] = useState<string>('');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const filteredSessions = selectedStudent === 'all'
    ? sessions
    : sessions.filter((s) => s.student_name === selectedStudent);

  const totalFee = filteredSessions.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);
  const paidFee = filteredSessions
    .filter((s) => s.is_paid)
    .reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);
  const unpaidFee = totalFee - paidFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header no-print */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between no-print bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Phiếu Tổng Kết Học Phí ({currentFilterLabel})
            </h3>
            {/* Filter student */}
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả học sinh ({sessions.length} buổi)</option>
              {stats.studentBreakdown.map((item) => (
                <option key={item.student_name} value={item.student_name}>
                  {item.student_name} ({item.sessions_count} buổi)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>In / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
          {/* Header phiếu */}
          <div className="flex items-start justify-between border-b pb-6 border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-blue-600">Zeanokai</span>
              </div>
              <p className="text-xs text-slate-500">Hệ thống sổ tay theo dõi buổi dạy gia sư</p>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-bold uppercase text-slate-800">PHIẾU BÁO HỌC PHÍ</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Kỳ học: {currentFilterLabel}</p>
              {selectedStudent !== 'all' && (
                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                  Học sinh: {selectedStudent}
                </p>
              )}
            </div>
          </div>

          {/* Bảng kê chi tiết các buổi học */}
          <div className="mt-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100/80 font-bold text-slate-700">
                  <th className="py-2.5 px-3 w-10 text-center">STT</th>
                  {selectedStudent === 'all' && <th className="py-2.5 px-3">Học sinh</th>}
                  <th className="py-2.5 px-3">Thứ, Ngày tháng năm</th>
                  <th className="py-2.5 px-3">Nội dung / Ghi chú</th>
                  <th className="py-2.5 px-3 text-right">Số tiền 1 buổi</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSessions.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                    {selectedStudent === 'all' && (
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.student_name}</td>
                    )}
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {formatFullDateVN(item.session_date)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs">{item.notes || '-'}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                      {formatVND(item.fee)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.is_paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.is_paid ? 'Đã thu' : 'Chưa thu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phần TỔNG KẾT */}
          <div className="mt-6 pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-slate-600 max-w-sm">
              <p className="font-semibold text-slate-800 mb-1">Ghi chú thanh toán:</p>
              <input
                type="text"
                placeholder="Điền STK / Ngân hàng / Lời nhắn tới phụ huynh..."
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none print:border-none print:p-0"
              />
              <p className="text-[11px] text-slate-400 mt-1 italic">
                Xin chân thành cảm ơn Quý phụ huynh đã tin tưởng và đồng hành cùng Gia sư!
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tổng số buổi dạy:</span>
                <span className="font-bold text-slate-900">{filteredSessions.length} buổi</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Đã thanh toán:</span>
                <span className="font-semibold text-emerald-600">{formatVND(paidFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Còn lại cần thu:</span>
                <span className="font-semibold text-amber-600">{formatVND(unpaidFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>TỔNG TIỀN:</span>
                <span className="text-base text-blue-600 font-extrabold">{formatVND(totalFee)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
