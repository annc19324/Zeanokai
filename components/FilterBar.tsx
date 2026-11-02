'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Filter, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { SessionFilter } from '@/lib/types';
import { getPreviousMonthInfo, getCurrentMonthInfo } from '@/lib/utils';

interface FilterBarProps {
  filter: SessionFilter;
  setFilter: React.Dispatch<React.SetStateAction<SessionFilter>>;
  studentList: string[];
  totalFilteredCount: number;
}

export default function FilterBar({
  filter,
  setFilter,
  studentList,
  totalFilteredCount,
}: FilterBarProps) {
  const [prevMonth, setPrevMonth] = useState({ month: '', year: '' });
  const [curMonth, setCurMonth] = useState({ month: '', year: '' });

  React.useEffect(() => {
    setPrevMonth(getPreviousMonthInfo());
    setCurMonth(getCurrentMonthInfo());
  }, []);

  const isPrevMonthActive = prevMonth.month && filter.month === prevMonth.month && filter.year === prevMonth.year;
  const isCurMonthActive = curMonth.month && filter.month === curMonth.month && filter.year === curMonth.year;
  const isAllTimeActive = filter.month === 'all' && filter.year === 'all';

  // Chuyển sang tháng trước (mặc định)
  const setPreviousMonth = () => {
    const p = getPreviousMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: p.month,
      year: p.year,
    }));
  };

  // Chuyển sang tháng này
  const setCurrentMonth = () => {
    const c = getCurrentMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: c.month,
      year: c.year,
    }));
  };

  // Xem tất cả
  const setAllMonths = () => {
    setFilter((prev) => ({
      ...prev,
      month: 'all',
      year: 'all',
    }));
  };

  // Đặt lại toàn bộ bộ lọc về mặc định (tháng trước)
  const handleResetFilter = () => {
    const p = getPreviousMonthInfo();
    setFilter({
      month: p.month,
      year: p.year,
      student: 'all',
      status: 'all',
      search: '',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      {/* Hàng 1: Nút bấm chọn nhanh tháng & Tìm kiếm */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Quick Month Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Chọn nhanh:
          </span>

          {/* Nút Tháng trước - Mặc định */}
          <button
            onClick={setPreviousMonth}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              isPrevMonthActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tháng trước {prevMonth.month ? `(${prevMonth.month}/${prevMonth.year})` : ''}</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">Mặc định</span>
          </button>

          {/* Nút Tháng này */}
          <button
            onClick={setCurrentMonth}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              isCurMonthActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tháng này {curMonth.month ? `(${curMonth.month}/${curMonth.year})` : ''}</span>
          </button>

          {/* Nút Tất cả */}
          <button
            onClick={setAllMonths}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              isAllTimeActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tất cả các tháng
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, ghi chú..."
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          {filter.search && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Hàng 2: Bộ lọc chi tiết nhiều cái (Tháng, Năm, Học sinh, Trạng thái) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Chọn Tháng */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Tháng
          </label>
          <select
            value={filter.month}
            onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="all">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m.toString()}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Năm */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Năm
          </label>
          <select
            value={filter.year}
            onChange={(e) => setFilter((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="all">Tất cả năm</option>
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y.toString()}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Học sinh */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Học sinh / Lớp
          </label>
          <select
            value={filter.student}
            onChange={(e) => setFilter((prev) => ({ ...prev, student: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 truncate"
          >
            <option value="all">Tất cả học sinh ({studentList.length})</option>
            {studentList.map((stu) => (
              <option key={stu} value={stu}>
                {stu}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái thanh toán */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Thanh toán
          </label>
          <select
            value={filter.status}
            onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="paid">✅ Đã thanh toán</option>
            <option value="unpaid">⏳ Chưa thanh toán</option>
          </select>
        </div>

        {/* Reset & Đếm kết quả */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end justify-between lg:justify-end gap-2">
          <button
            onClick={handleResetFilter}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            title="Đặt lại bộ lọc về tháng trước mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 py-1.5">
            Tìm thấy: <strong className="text-blue-600 dark:text-blue-400">{totalFilteredCount}</strong> buổi
          </span>
        </div>
      </div>
    </div>
  );
}
