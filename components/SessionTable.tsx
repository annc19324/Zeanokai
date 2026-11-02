'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { TutoringSession } from '@/lib/types';
import { formatFullDateVN, formatVND } from '@/lib/utils';

interface SessionTableProps {
  sessions: TutoringSession[];
  onEdit: (session: TutoringSession) => void;
  onDelete: (id: number) => void;
  onDuplicate: (session: TutoringSession) => void;
  onTogglePaid: (id: number, currentStatus: boolean) => void;
}

export default function SessionTable({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePaid,
}: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Chưa có buổi dạy nào trong danh sách
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Không tìm thấy buổi dạy nào khớp với bộ lọc hiện tại. Bạn có thể chọn tháng khác hoặc bấm &ldquo;Thêm buổi dạy&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">STT</th>
              <th className="py-3 px-4">Tên học sinh / Môn học</th>
              <th className="py-3 px-4">Thứ, Ngày tháng năm</th>
              <th className="py-3 px-4">Số tiền 1 buổi</th>
              <th className="py-3 px-4">Ghi chú buổi dạy</th>
              <th className="py-3 px-4 text-center">Thanh toán</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {sessions.map((item, index) => {
              const fullDate = formatFullDateVN(item.session_date);
              const isWeekend = fullDate.startsWith('Thứ Bảy') || fullDate.startsWith('Chủ Nhật');

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* STT */}
                  <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-mono">
                    {index + 1}
                  </td>

                  {/* Tên học sinh */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      <span>{item.student_name}</span>
                    </div>
                  </td>

                  {/* Thứ ngày tháng năm */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${
                          isWeekend
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {fullDate}
                      </span>
                      {(item.start_time || item.end_time) && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {item.start_time || ''} {item.end_time ? `- ${item.end_time}` : ''}
                          </span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Số tiền 1 buổi */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatVND(item.fee)}
                    </span>
                  </td>

                  {/* Ghi chú */}
                  <td className="py-3.5 px-4 max-w-xs">
                    {item.notes ? (
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2" title={item.notes}>
                          {item.notes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Không có ghi chú</span>
                    )}
                  </td>

                  {/* Trạng thái thanh toán (Toggle 1 click) */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onTogglePaid(item.id, item.is_paid)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        item.is_paid
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                      title="Bấm để đổi trạng thái thanh toán"
                    >
                      {item.is_paid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Đã trả</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Chưa trả</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Thao tác (Sửa, Xoá, Nhân bản) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Nhân bản */}
                      <button
                        onClick={() => onDuplicate(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Nhân bản buổi học này"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Sửa */}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Xoá */}
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Xoá buổi học này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
