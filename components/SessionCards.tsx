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

interface SessionCardsProps {
  sessions: TutoringSession[];
  onEdit: (session: TutoringSession) => void;
  onDelete: (id: number) => void;
  onDuplicate: (session: TutoringSession) => void;
  onTogglePaid: (id: number, currentStatus: boolean) => void;
}

export default function SessionCards({
  sessions,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePaid,
}: SessionCardsProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Chưa có buổi dạy nào trong tháng này
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {sessions.map((item) => {
        const fullDate = formatFullDateVN(item.session_date);
        const isWeekend = fullDate.startsWith('Thứ Bảy') || fullDate.startsWith('Chủ Nhật');

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Header Thẻ: Tên học sinh & Học phí */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {item.student_name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span
                      className={`font-semibold ${
                        isWeekend ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fullDate}
                    </span>
                  </div>
                </div>

                {/* Số tiền 1 buổi */}
                <div className="text-right">
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 block">
                    {formatVND(item.fee)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">1 buổi</span>
                </div>
              </div>

              {/* Giờ học nếu có */}
              {(item.start_time || item.end_time) && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {item.start_time || ''} {item.end_time ? `- ${item.end_time}` : ''}
                  </span>
                </div>
              )}

              {/* Ghi chú */}
              {item.notes && (
                <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-3">{item.notes}</p>
                </div>
              )}
            </div>

            {/* Footer Thẻ: Trạng thái & Thao tác */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {/* Button Toggle Thanh toán */}
              <button
                onClick={() => onTogglePaid(item.id, item.is_paid)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  item.is_paid
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {item.is_paid ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã trả tiền</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chưa trả tiền</span>
                  </>
                )}
              </button>

              {/* Thao tác Sửa, Xóa, Copy */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDuplicate(item)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                  title="Nhân bản"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded-lg"
                  title="Sửa"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 rounded-lg"
                  title="Xoá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
