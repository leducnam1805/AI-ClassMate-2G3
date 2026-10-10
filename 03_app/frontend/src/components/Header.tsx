'use strict';
import React from 'react';
import { Award, AlertTriangle, ShieldCheck, Sparkles, School } from 'lucide-react';

interface HeaderProps {
  unresolvedCount: number;
  approvedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ unresolvedCount, approvedCount, totalCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  AI ClassMate 2G3
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  MVP v1.0
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="flex items-center font-medium text-slate-700">
                  <School className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Trường TH Núi Thành
                </span>
                <span>•</span>
                <span className="font-semibold text-blue-600">Lớp 2G3</span>
                <span>•</span>
                <span>Tháng 9/2026</span>
              </div>
            </div>
          </div>

          {/* Right Contest Badge & Status Indicators */}
          <div className="flex items-center space-x-4">
            {/* Contest info pill */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Hội thi Nhà giáo sáng tạo 2026 (CV 4723)</span>
            </div>

            {/* Quick Audit Issues counter */}
            {unresolvedCount > 0 ? (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{unresolvedCount} điểm cần rà soát</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dữ liệu đã chuẩn hóa</span>
              </div>
            )}

            {/* AI Approval progress */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Duyệt nhận xét:</span>
              <span className="font-bold text-indigo-600">{approvedCount}/{totalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
