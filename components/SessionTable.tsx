'use client';

import React from 'react';
import { Edit3, Trash2, Calendar, FileText } from 'lucide-react';
import { TutoringSession } from '@/lib/types';
import { formatFullDateVN, formatVND } from '@/lib/utils';

interface SessionTableProps {
  sessions: TutoringSession[];
  onEdit: (session: TutoringSession) => void;
  onDelete: (id: number) => void;
  totalSessions: number;
  totalFee: number;
}

export default function SessionTable({
  sessions,
  onEdit,
  onDelete,
  totalSessions,
  totalFee,
}: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Chưa có buổi dạy nào trong danh sách
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Bấm &ldquo;Thêm buổi dạy&rdquo; để bắt đầu ghi chép.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-3.5 w-12 text-center">STT</th>
              <th className="py-3 px-3.5">Tên</th>
              <th className="py-3 px-3.5">Thứ ngày tháng năm</th>
              <th className="py-3 px-3.5">Số tiền 1 buổi</th>
              <th className="py-3 px-3.5">Ghi chú</th>
              <th className="py-3 px-3.5 text-right w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((item, index) => {
              const fullDate = formatFullDateVN(item.session_date);
              return (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* STT */}
                  <td className="py-3 px-3.5 text-center text-xs text-slate-400 font-mono">
                    {index + 1}
                  </td>

                  {/* Tên */}
                  <td className="py-3 px-3.5 font-semibold text-slate-900">
                    {item.student_name}
                  </td>

                  {/* Thứ ngày tháng năm */}
                  <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                    {fullDate}
                  </td>

                  {/* Số tiền 1 buổi */}
                  <td className="py-3 px-3.5 font-bold text-blue-600 whitespace-nowrap">
                    {formatVND(item.fee)}
                  </td>

                  {/* Ghi chú */}
                  <td className="py-3 px-3.5 text-xs text-slate-600 max-w-xs">
                    {item.notes || '-'}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Dòng TỔNG CỘNG */}
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
              <td colSpan={3} className="py-3 px-3.5 text-right uppercase text-xs tracking-wider">
                Tổng: <span className="text-blue-600 font-extrabold ml-1">{totalSessions}</span> buổi
              </td>
              <td colSpan={3} className="py-3 px-3.5 text-left text-base text-blue-700 font-extrabold">
                {formatVND(totalFee)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
