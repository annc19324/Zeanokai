'use client';

import React from 'react';
import { Edit3, Trash2, Calendar } from 'lucide-react';
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
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Chưa có buổi dạy nào trong danh sách
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Bấm &ldquo;Thêm buổi dạy&rdquo; hoặc dùng chức năng Tự động để bắt đầu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">STT</th>
              <th className="py-2.5 px-3">Tên</th>
              <th className="py-2.5 px-3">Ngày</th>
              <th className="py-2.5 px-3">HP/buổi</th>
              <th className="py-2.5 px-3">Ghi chú</th>
              <th className="py-2.5 px-3 text-right w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((item, index) => {
              const fullDate = formatFullDateVN(item.session_date);
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 text-center text-xs text-slate-400 font-mono">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {item.student_name}
                  </td>
                  <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                    {fullDate}
                  </td>
                  <td className="py-2 px-3 font-bold text-blue-600 whitespace-nowrap">
                    {formatVND(item.fee)}
                  </td>
                  <td className="py-2 px-3 text-xs text-slate-600 max-w-xs truncate" title={item.notes || ''}>
                    {item.notes || '-'}
                  </td>
                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                        title="Xoá"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs sm:text-sm">
              <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-xs">
                Tổng: <span className="text-blue-600 font-extrabold ml-1">{totalSessions}</span> buổi
              </td>
              <td colSpan={3} className="py-2.5 px-3 text-left text-blue-700 font-extrabold text-sm sm:text-base">
                {formatVND(totalFee)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
