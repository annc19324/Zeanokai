'use client';

import React from 'react';
import { GraduationCap, Plus, Printer, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenPrintModal: () => void;
  onOpenAutoScheduleModal: () => void;
}

export default function Navbar({
  onOpenAddModal,
  onOpenPrintModal,
  onOpenAutoScheduleModal,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tên Web */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Zeanokai
              </span>
              <p className="text-[11px] text-slate-500">
                Sổ lưu trữ buổi dạy gia sư
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Cài đặt tự động */}
            <button
              onClick={onOpenAutoScheduleModal}
              className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition-colors"
              title="Cài lịch học cố định hàng tuần và tự động tạo cả tháng"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Cài đặt tự động</span>
            </button>

            {/* In phiếu / Xuất PDF */}
            <button
              onClick={onOpenPrintModal}
              className="px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">In phiếu / Xuất PDF</span>
              <span className="sm:hidden">In/PDF</span>
            </button>

            {/* Thêm buổi dạy */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm buổi</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
