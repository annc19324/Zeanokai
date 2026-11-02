'use client';

import React, { useState } from 'react';
import { X, Printer, Plus, Minus, RotateCcw } from 'lucide-react';
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

  const [adjustmentType, setAdjustmentType] = useState<'-' | '+'>('-');
  const [adjustmentInput, setAdjustmentInput] = useState<string>('');
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Tháng trước chuyển thừa');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleAmountChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    setAdjustmentInput(raw);
    setAdjustmentAmount(raw ? parseInt(raw, 10) : 0);
  };

  const resetAdjustment = () => {
    setAdjustmentInput('');
    setAdjustmentAmount(0);
    setAdjustmentReason('Tháng trước chuyển thừa');
  };

  const students = Array.from(new Set(sessions.map((s) => s.student_name)));

  const filteredSessions = selectedStudent === 'all'
    ? sessions
    : sessions.filter((s) => s.student_name === selectedStudent);

  const totalFee = filteredSessions.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0);

  const finalAmount = adjustmentType === '-'
    ? totalFee - adjustmentAmount
    : totalFee + adjustmentAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header điều khiển (Ẩn khi in) */}
        <div className="px-3.5 py-2 border-b border-slate-200 no-print bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                In phiếu ({currentFilterLabel})
              </span>
              {students.length > 1 && (
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-800"
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

          {/* Hàng điều chỉnh tiền - Bỏ placeholder */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-xs">
            <span className="font-medium text-slate-600">Điều chỉnh:</span>

            <div className="flex rounded border border-slate-300 overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setAdjustmentType('-')}
                className={`px-2 py-0.5 font-bold flex items-center gap-0.5 ${
                  adjustmentType === '-'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Trừ bớt"
              >
                <Minus className="w-3 h-3" /> Trừ
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('+')}
                className={`px-2 py-0.5 font-bold flex items-center gap-0.5 ${
                  adjustmentType === '+'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Cộng thêm"
              >
                <Plus className="w-3 h-3" /> Cộng
              </button>
            </div>

            <input
              type="text"
              value={adjustmentInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-28 px-2 py-0.5 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none"
            />

            <input
              type="text"
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              className="flex-1 min-w-[150px] px-2 py-0.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
            />

            {adjustmentAmount > 0 && (
              <button
                type="button"
                onClick={resetAdjustment}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Bỏ điều chỉnh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Khung nội dung in phiếu - Gọn gàng không cần cuộn */}
        <div className="p-4 overflow-y-auto max-h-[76vh] bg-white text-slate-900 print:p-0">
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
              {adjustmentAmount > 0 ? (
                /* 3 cái trên cùng 1 dòng, cỡ chữ bằng nhau */
                <tr className="border-t-2 border-slate-400 bg-slate-50 text-xs font-bold text-slate-900">
                  <td colSpan={selectedStudent === 'all' ? 5 : 4} className="py-2.5 px-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                      <span>
                        Tổng học phí ({filteredSessions.length} buổi): {formatVND(totalFee)}
                      </span>
                      <span>
                        {adjustmentType === '-' ? 'Trừ' : 'Cộng'}: {adjustmentReason ? `(${adjustmentReason})` : ''} {adjustmentType} {formatVND(adjustmentAmount)}
                      </span>
                      <span>
                        TỔNG THANH TOÁN: {formatVND(finalAmount)}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="border-t-2 border-slate-400 bg-slate-50 text-xs font-bold text-slate-900">
                  <td colSpan={selectedStudent === 'all' ? 3 : 2} className="py-2 px-2 text-right uppercase border-r border-slate-300">
                    Tổng: {filteredSessions.length} buổi
                  </td>
                  <td colSpan={2} className="py-2 px-2 text-left font-bold text-blue-700">
                    {formatVND(totalFee)}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
