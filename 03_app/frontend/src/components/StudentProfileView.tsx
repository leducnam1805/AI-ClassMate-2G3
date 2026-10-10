'use strict';
import React, { useState } from 'react';
import { Student } from '../types';
import { 
  User, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  Target, 
  HeartHandshake, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentProfileViewProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onUpdateStudent: (updated: Student) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ 
  students, 
  selectedStudent,
  onSelectStudent,
  onUpdateStudent 
}) => {
  const currentStudent = selectedStudent || students[0];
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleCopyParentMessage = () => {
    if (!currentStudent) return;
    navigator.clipboard.writeText(currentStudent.educationalPlan.parentCommunication);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Selector bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-600" />
          <h1 className="text-base font-bold text-slate-800">
            Hồ Sơ Theo Dõi Tiến Bộ & Kế Hoạch Chủ Nhiệm
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-500 font-medium">Chọn học sinh:</label>
          <select
            value={currentStudent?.id}
            onChange={(e) => {
              const found = students.find(s => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {students.map(st => (
              <option key={st.id} value={st.id}>
                {st.stt}. {st.name} ({st.code}) — {st.auditedTotal}đ {st.isExcellent ? '★' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Identity & Behavior Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200 mb-3">
                {currentStudent.name.charAt(0)}
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">{currentStudent.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã định danh: <span className="font-mono font-bold text-slate-700">{currentStudent.code}</span> • Giới tính: {currentStudent.gender}
              </p>

              {currentStudent.isExcellent && (
                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black border border-amber-300">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>HỌC SINH XUẤT SẮC THÁNG 9</span>
                </div>
              )}
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Điểm cộng</span>
                <p className="text-xl font-black text-emerald-700 mt-0.5">+{currentStudent.auditedBonus}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-700">Điểm trừ</span>
                <p className="text-xl font-black text-rose-700 mt-0.5">-{currentStudent.auditedPenalty}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-indigo-700">Tổng điểm</span>
                <p className={`text-xl font-black mt-0.5 ${currentStudent.auditedTotal < 0 ? 'text-rose-600' : 'text-indigo-700'}`}>
                  {currentStudent.auditedTotal}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700">Phần quà</span>
                <p className="text-xl font-black text-amber-700 mt-0.5">
                  {currentStudent.auditedGifts} <span className="text-xs font-normal">quà</span>
                </p>
              </div>
            </div>

            {/* Observed Behaviors Breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Điểm mạnh được ghi nhận:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentStudent.educationalPlan.strength.length > 0 ? (
                  currentStudent.educationalPlan.strength.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Đang cập nhật thêm điểm mạnh</span>
                )}
              </div>

              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center pt-2">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                Biểu hiện cần rèn luyện:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentStudent.educationalPlan.weakness.length > 0 ? (
                  currentStudent.educationalPlan.weakness.map((w, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      • {w}
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                    Không có biểu hiện vi phạm lớn
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Educational Plan & Parent Messaging */}
          <div className="lg:col-span-2 space-y-6">
            {/* Approved Teacher Comment Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                  Nhận Xét Đánh Giá Tháng 9 Của Giáo Viên Chủ Nhiệm
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentStudent.commentStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentStudent.commentStatus === 'APPROVED' ? 'Đã duyệt' : 'Bản nháp'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-normal">
                "{currentStudent.teacherComment}"
              </div>
            </div>

            {/* Continuous Educational Intervention Cycle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Kế Hoạch Rèn Luyện & Theo Dõi Tiến Bộ (Tuần 1 Tháng 10)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-900 block mb-1">
                    🎯 Mục tiêu rèn luyện ngắn hạn:
                  </span>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {currentStudent.educationalPlan.weeklyGoal}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                  <span className="text-xs font-bold text-purple-900 block mb-1">
                    💡 Biện pháp sư phạm của GVCN:
                  </span>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    {currentStudent.educationalPlan.intervention}
                  </p>
                </div>
              </div>
            </div>

            {/* Parent Communication Assistant */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Mẫu Trao Đổi Phối Hợp Với Phụ Huynh (AI Soạn Thảo)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ngôn từ tích cực, tôn trọng, hướng tới sự đồng hành của gia đình.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyParentMessage}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  {copiedMessage ? '✓ Đã sao chép!' : 'Sao chép tin nhắn'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                "{currentStudent.educationalPlan.parentCommunication}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
