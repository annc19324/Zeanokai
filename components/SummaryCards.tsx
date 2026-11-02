'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Users 
} from 'lucide-react';
import { SummaryStats } from '@/lib/types';
import { formatVND } from '@/lib/utils';

interface SummaryCardsProps {
  stats: SummaryStats;
  currentFilterLabel: string;
}

export default function SummaryCards({ stats, currentFilterLabel }: SummaryCardsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="space-y-3">
      {/* 4 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tổng số buổi */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng số buổi
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalSessions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">buổi</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            {stats.studentBreakdown.length} học sinh ({currentFilterLabel})
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Card 2: Tổng học phí */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng học phí
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 block truncate">
              {formatVND(stats.totalFee)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            Tính theo bộ lọc hiện tại
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* Card 3: Đã thanh toán */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Đã thanh toán
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 block truncate">
              {formatVND(stats.paidFee)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1">
            <span>Đã thu thành công</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Card 4: Chưa thanh toán / Cần thu */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Chưa thanh toán
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 block truncate">
              {formatVND(stats.unpaidFee)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400/80 flex items-center gap-1">
            <span>Cần phụ huynh gửi</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>
      </div>

      {/* Phân tích theo từng học sinh (Accordion tiện lợi) */}
      {stats.studentBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 text-sm">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-left font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Xem chi tiết học phí từng học sinh ({stats.studentBreakdown.length} học sinh)</span>
            </div>
            {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBreakdown && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {stats.studentBreakdown.map((item) => (
                <div
                  key={item.student_name}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <strong className="text-slate-800 dark:text-slate-100 truncate text-xs sm:text-sm font-semibold">
                      {item.student_name}
                    </strong>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                      {item.sessions_count} buổi
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Tổng tiền:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formatVND(item.total_fee)}</span>
                    </div>
                    {item.unpaid_fee > 0 && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                        <span>Chưa thu:</span>
                        <span>{formatVND(item.unpaid_fee)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
