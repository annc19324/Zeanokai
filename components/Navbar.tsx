'use client';

import React from 'react';
import { 
  GraduationCap, 
  Plus, 
  Moon, 
  Sun, 
  Download, 
  Printer, 
  LayoutGrid, 
  List
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  viewMode: 'table' | 'cards';
  setViewMode: (val: 'table' | 'cards') => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onOpenPrintModal: () => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  viewMode,
  setViewMode,
  onOpenAddModal,
  onExportCSV,
  onOpenPrintModal,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tên Web */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Zeanokai
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Gia Sư
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Sổ tay lưu trữ & tính tiền các buổi dạy
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Chuyển chế độ xem Table / Card trên desktop */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
                title="Dạng bảng chi tiết"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
                title="Dạng thẻ lưới"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* In / Xuất báo cáo */}
            <button
              onClick={onOpenPrintModal}
              className="p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
              title="In phiếu báo học phí"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">In phiếu</span>
            </button>

            {/* Xuất Excel/CSV */}
            <button
              onClick={onExportCSV}
              className="p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Xuất file Excel / CSV"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>

            {/* Đổi giao diện Sáng / Tối */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Nút Thêm buổi dạy mới */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm buổi dạy</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
