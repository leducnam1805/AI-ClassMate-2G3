'use strict';
import React from 'react';
import { Student } from '../types';
import { TabKey } from './Sidebar';
import { 
  Users, 
  Gift, 
  AlertCircle, 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  onNavigate: (tab: TabKey) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  students, 
  onNavigate,
  onSelectStudent 
}) => {
  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'Nam').length;
  const femaleCount = students.filter(s => s.gender === 'Nữ').length;

  const totalBonus = students.reduce((acc, s) => acc + s.auditedBonus, 0);
  const totalPenalty = students.reduce((acc, s) => acc + s.auditedPenalty, 0);
  const giftStudents = students.filter(s => s.auditedGifts > 0);
  const totalGifts = students.reduce((acc, s) => acc + s.auditedGifts, 0);
  
  const negativeScoreStudents = students.filter(s => s.auditedTotal < 0);
  const excellentStudents = students.filter(s => s.isExcellent);
  
  const allIssues = students.flatMap(s => s.issues);
  const unresolvedIssues = allIssues.filter(i => !i.resolved);

  return (
    <div className="space-y-6">
      {/* Top Banner introducing the Research Project */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mô hình trợ lý AI hỗ trợ công tác chủ nhiệm lớp tiểu học</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            AI ClassMate 2G3 — Bảng Điều Hành Lớp Học
          </h1>
          <p className="mt-2 text-sm md:text-base text-blue-100 leading-relaxed">
            Chuyển đổi quy trình chủ nhiệm từ ghi nhận thủ công sang mô hình số khép kín: 
            <strong> Tự động rà soát sai lệch → Chuẩn hóa quy tắc điểm (BR-001..008) → Trợ lý AI gợi ý nhận xét & biện pháp giáo dục.</strong>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('audit')}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-md hover:bg-blue-50 transition-all"
            >
              Xem Bảng Thi Đua & Rà Soát
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur-md transition-all"
            >
              Mở Trợ Lý Nhận Xét AI
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sĩ số & Học sinh */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sĩ số học sinh</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center space-x-2">
            <span className="font-semibold text-blue-600">{maleCount} Nam</span>
            <span>•</span>
            <span className="font-semibold text-purple-600">{femaleCount} Nữ</span>
            <span>•</span>
            <span className="text-slate-400">100% đủ hồ sơ</span>
          </div>
        </div>

        {/* Card 2: Quà thi đua tháng */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Khen thưởng tháng 9</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-600">{totalGifts}</span>
            <span className="text-xs text-slate-500 font-medium">phần quà</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800">{giftStudents.length} / {totalStudents}</span> học sinh đạt quà (
            {Math.round((giftStudents.length / totalStudents) * 100)}%)
          </div>
        </div>

        {/* Card 3: Rà soát & Lỗi dữ liệu */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Kiểm toán dữ liệu (BR)</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              unresolvedIssues.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {unresolvedIssues.length > 0 ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-black ${unresolvedIssues.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {unresolvedIssues.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">điểm chưa chốt</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Đã chuẩn hóa: <strong className="text-emerald-600">{allIssues.length - unresolvedIssues.length}</strong></span>
            <button 
              onClick={() => onNavigate('audit')} 
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Rà soát ngay →
            </button>
          </div>
        </div>

        {/* Card 4: Học sinh cần can thiệp */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Cần hỗ trợ & rèn luyện</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-rose-600">{negativeScoreStudents.length}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh âm điểm</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Có kế hoạch tuần 1: <strong className="text-indigo-600">{negativeScoreStudents.length}/4</strong></span>
            <button 
              onClick={() => onNavigate('profiles')}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Xem hồ sơ →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Honor Board & Audit Alert Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Bảng vinh danh Xuất sắc tháng 9 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Xuất Sắc Tháng 9/2026</h2>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              3 học sinh
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Danh sách ghi nhận từ tài liệu nguồn Excel và chuẩn hóa qua hệ thống tính quà BR-005.
          </p>

          <div className="space-y-3">
            {excellentStudents.map((st, index) => (
              <div 
                key={st.id}
                onClick={() => {
                  onSelectStudent(st);
                  onNavigate('profiles');
                }}
                className="group p-3.5 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/30 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                        {st.name}
                      </h3>
                      <span className="text-xs text-slate-500">Mã: {st.code} • {st.gender}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-amber-700">{st.auditedTotal}đ</span>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {st.auditedGifts} quà (dư {st.auditedRemainder})
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-amber-100/80 flex items-center justify-between text-xs text-slate-600">
                  <span className="truncate max-w-[200px] text-[11px] italic text-slate-500">
                    "{st.rawNote || 'Tích cực rèn luyện'}"
                  </span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Hồ sơ →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tiêu chí: Điểm thi đua cao, nề nếp tốt và được GVCN đề xuất.</span>
          </div>
        </div>

        {/* Right Column (2 cols): Bảng rà soát dữ liệu đối chiếu BR-001..008 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  Các Phát Hiện Rà Soát Dữ Liệu Từ Excel Nguồn
                </h2>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                Quản lý rà soát chi tiết ({allIssues.length}) →
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Các trường hợp sai lệch công thức hoặc mâu thuẫn tiêu chí được phát hiện tự động bởi thuật toán kiểm toán quy tắc:
            </p>

            <div className="space-y-3">
              {allIssues.slice(0, 4).map((issue) => {
                const student = students.find(s => s.issues.some(i => i.id === issue.id));
                return (
                  <div 
                    key={issue.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-200 transition-all flex items-start justify-between space-x-3"
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                        issue.severity === 'BLOCKING' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {issue.ruleRef}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800">
                            {student?.name} ({student?.code})
                          </span>
                          <span className="text-[11px] text-slate-400">• Trường: {issue.field}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {issue.description}
                        </p>
                        <p className="text-[11px] text-indigo-600 font-medium mt-1">
                          ↳ Hướng giải quyết: {issue.suggestion}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {issue.resolved ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          Đã xử lý
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                          Chờ chốt
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom research comparison teaser */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Hiệu quả đo lường NCKH: Tiết kiệm 93.6% thời gian
                </h4>
                <p className="text-[11px] text-slate-500">
                  Từ 440 phút (thủ công) xuống chỉ còn 28 phút. Sai sót tính toán giảm từ 15.4% về 0.0%.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Xem số liệu NCKH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
