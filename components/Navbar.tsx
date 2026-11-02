'use client';

import React from 'react';
import { GraduationCap, Plus, Printer, FileDown } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenPrintModal: () => void;
}

export default function Navbar({
  onOpenAddModal,
  onOpenPrintModal,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tên Web */}
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2.5">
            {/* In phiếu / Xuất PDF */}
            <button
              onClick={onOpenPrintModal}
              className="px-3.5 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>In phiếu / Xuất PDF</span>
            </button>

            {/* Thêm buổi dạy */}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
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
