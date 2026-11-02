'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SessionFilter } from '@/lib/types';
import { getPreviousMonthInfo, getCurrentMonthInfo } from '@/lib/utils';

interface FilterBarProps {
  filter: SessionFilter;
  setFilter: React.Dispatch<React.SetStateAction<SessionFilter>>;
  studentList: string[];
}

export default function FilterBar({
  filter,
  setFilter,
  studentList,
}: FilterBarProps) {
  const [prevMonth, setPrevMonth] = useState({ month: '', year: '' });
  const [curMonth, setCurMonth] = useState({ month: '', year: '' });

  useEffect(() => {
    setPrevMonth(getPreviousMonthInfo());
    setCurMonth(getCurrentMonthInfo());
  }, []);

  const isPrevMonthActive = prevMonth.month && filter.month === prevMonth.month && filter.year === prevMonth.year;
  const isCurMonthActive = curMonth.month && filter.month === curMonth.month && filter.year === curMonth.year;
  const isAllTimeActive = filter.month === 'all' && filter.year === 'all';

  // Chuyển sang tháng trước của tháng hiện tại (Mặc định)
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

  // Xem tất cả các tháng
  const setAllMonths = () => {
    setFilter((prev) => ({
      ...prev,
      month: 'all',
      year: 'all',
    }));
  };

  // Nút lùi 1 tháng gọn lẹ (◀)
  const handlePrevMonthStep = () => {
    const baseMonth = filter.month === 'all' || !filter.month ? parseInt(prevMonth.month || '10', 10) : parseInt(filter.month, 10);
    const baseYear = filter.year === 'all' || !filter.year ? parseInt(prevMonth.year || '2026', 10) : parseInt(filter.year, 10);

    let nextM = baseMonth - 1;
    let nextY = baseYear;
    if (nextM < 1) {
      nextM = 12;
      nextY -= 1;
    }

    setFilter((prev) => ({
      ...prev,
      month: nextM.toString(),
      year: nextY.toString(),
    }));
  };

  // Nút tiến 1 tháng gọn lẹ (▶)
  const handleNextMonthStep = () => {
    const baseMonth = filter.month === 'all' || !filter.month ? parseInt(prevMonth.month || '10', 10) : parseInt(filter.month, 10);
    const baseYear = filter.year === 'all' || !filter.year ? parseInt(prevMonth.year || '2026', 10) : parseInt(filter.year, 10);

    let nextM = baseMonth + 1;
    let nextY = baseYear;
    if (nextM > 12) {
      nextM = 1;
      nextY += 1;
    }

    setFilter((prev) => ({
      ...prev,
      month: nextM.toString(),
      year: nextY.toString(),
    }));
  };

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
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
      {/* Hàng 1: Di chuyển qua các tháng gọn lẹ & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Cụm nút di chuyển qua các tháng gọn lẹ: [ ◀ ] Tháng M/YYYY [ ▶ ] */}
          <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 overflow-hidden shadow-xs">
            <button
              onClick={handlePrevMonthStep}
              className="px-2 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Lùi về 1 tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-xs sm:text-sm text-blue-700 whitespace-nowrap border-x border-slate-300 bg-white">
              {filter.month === 'all' ? 'Tất cả' : `Tháng ${filter.month}/${filter.year}`}
            </span>
            <button
              onClick={handleNextMonthStep}
              className="px-2 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Tiến sang 1 tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Nút Tháng trước - Mặc định */}
          <button
            onClick={setPreviousMonth}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              isPrevMonthActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tháng trước {prevMonth.month ? `(T${prevMonth.month}/${prevMonth.year})` : ''}</span>
          </button>

          {/* Nút Tháng này */}
          <button
            onClick={setCurrentMonth}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              isCurMonthActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tháng này {curMonth.month ? `(T${curMonth.month}/${curMonth.year})` : ''}
          </button>

          {/* Nút Tất cả */}
          <button
            onClick={setAllMonths}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              isAllTimeActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
        </div>

        {/* Ô Tìm kiếm (Đã bỏ placeholder) */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Hàng 2: Bộ lọc chi tiết */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Lọc theo Tháng
          </label>
          <select
            value={filter.month}
            onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m.toString()}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Lọc theo Năm
          </label>
          <select
            value={filter.year}
            onChange={(e) => setFilter((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tất cả năm</option>
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y.toString()}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Lọc theo Tên
          </label>
          <select
            value={filter.student}
            onChange={(e) => setFilter((prev) => ({ ...prev, student: e.target.value }))}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 truncate"
          >
            <option value="all">Tất cả ({studentList.length})</option>
            {studentList.map((stu) => (
              <option key={stu} value={stu}>
                {stu}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleResetFilter}
            className="w-full py-1.5 px-3 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 transition-colors"
            title="Quay lại tháng trước mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
        </div>
      </div>
    </div>
  );
}
