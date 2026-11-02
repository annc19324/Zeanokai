'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, RotateCcw } from 'lucide-react';
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

  const setPreviousMonth = () => {
    const p = getPreviousMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: p.month,
      year: p.year,
    }));
  };

  const setCurrentMonth = () => {
    const c = getCurrentMonthInfo();
    setFilter((prev) => ({
      ...prev,
      month: c.month,
      year: c.year,
    }));
  };

  const setAllMonths = () => {
    setFilter((prev) => ({
      ...prev,
      month: 'all',
      year: 'all',
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
      {/* Nút chọn nhanh tháng & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
            <span className="text-[10px] bg-black/10 px-1 py-0.2 rounded font-normal">Mặc định</span>
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

        {/* Tìm kiếm */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên, ghi chú..."
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bộ lọc chi tiết: Tháng, Năm, Học sinh */}
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
