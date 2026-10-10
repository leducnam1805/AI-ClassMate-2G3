'use strict';
import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Bot, 
  Sparkles, 
  CheckCheck, 
  Edit3, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  FileCheck,
  Search,
  Filter,
  Lightbulb
} from 'lucide-react';

interface AIAssistantViewProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  onSelectStudent: (student: Student) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ 
  students, 
  onUpdateStudent,
  onSelectStudent 
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [tone, setTone] = useState<'ENCOURAGING' | 'BALANCED' | 'INTERVENTION'>('ENCOURAGING');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [filterApproved, setFilterApproved] = useState<'ALL' | 'DRAFT' | 'APPROVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterApproved === 'DRAFT') return s.commentStatus === 'DRAFT';
    if (filterApproved === 'APPROVED') return s.commentStatus === 'APPROVED';
    return true;
  });

  const handleApprove = (student: Student) => {
    onUpdateStudent({
      ...student,
      commentStatus: 'APPROVED'
    });
  };

  const handleReject = (student: Student) => {
    onUpdateStudent({
      ...student,
      commentStatus: 'REJECTED'
    });
  };

  const handleUpdateTeacherComment = (text: string) => {
    if (!currentStudent) return;
    onUpdateStudent({
      ...currentStudent,
      teacherComment: text
    });
  };

  const handleRegenerateDraft = () => {
    if (!currentStudent) return;
    setIsRegenerating(true);

    setTimeout(() => {
      let newDraft = '';
      const bonus = currentStudent.auditedBonus;
      const penalty = currentStudent.auditedPenalty;
      const total = currentStudent.auditedTotal;
      const gifts = currentStudent.auditedGifts;

      if (tone === 'ENCOURAGING') {
        if (total >= 20) {
          newDraft = `Em ${currentStudent.name} có một tháng học tập rất xuất sắc! Em luôn tích cực phát biểu xây dựng bài (${bonus} điểm cộng) và nhận được ${gifts} món quà thi đua. Thầy/cô biểu dương và chúc em tiếp tục giữ vững niềm say mê học tập trong tháng 10!`;
        } else if (total >= 0) {
          newDraft = `Em ${currentStudent.name} có nhiều cố gắng, chăm ngoan và tích cực tham gia các tiết học (${bonus} điểm cộng). Em cần rèn luyện thêm sự tập trung và chú ý nề nếp để tích lũy thêm nhiều phần quà thi đua nhé. Thầy cô luôn tin tưởng ở em!`;
        } else {
          newDraft = `Em ${currentStudent.name} đã bắt đầu có cố gắng trong việc phát biểu bài (${bonus} điểm cộng). Dù còn một số biểu hiện cần rèn nề nếp, thầy cô tin rằng với sự đồng hành của gia đình và sự kiên nhẫn của bản thân, em sẽ có nhiều tiến bộ tích cực trong tháng tới!`;
        }
      } else if (tone === 'BALANCED') {
        newDraft = `Đánh giá tháng 9: Em ${currentStudent.name} đạt tổng điểm thi đua ${total} điểm (+${bonus} điểm cộng, -${penalty} điểm trừ), nhận ${gifts} món quà. Em tiếp thu bài khá tốt. Cần nghiêm túc khắc phục các lỗi nề nếp đã được nhắc nhở để hoàn thiện bản thân hơn.`;
      } else {
        newDraft = `Kế hoạch rèn luyện tháng 10 cho ${currentStudent.name}: Phát huy điểm mạnh về phát biểu bài. Tập trung khắc phục triệt để: ${currentStudent.rawNote || 'chưa tập trung, nói chuyện riêng'}. Giáo viên chủ nhiệm phối hợp cùng phụ huynh theo dõi sát sao từng tuần.`;
      }

      onUpdateStudent({
        ...currentStudent,
        aiCommentDraft: newDraft,
        teacherComment: newDraft,
        commentStatus: 'DRAFT'
      });
      setIsRegenerating(false);
    }, 500);
  };

  const handleBatchApproveAll = () => {
    students.forEach(st => {
      if (st.commentStatus === 'DRAFT') {
        onUpdateStudent({
          ...st,
          commentStatus: 'APPROVED'
        });
      }
    });
  };

  const approvedCount = students.filter(s => s.commentStatus === 'APPROVED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Trợ Lý AI Soạn Thảo Nhận Xét Cuối Tháng</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ứng dụng mô hình ngôn ngữ lớn (LLM) hỗ trợ giáo viên chuyển đổi <strong>minh chứng hành vi</strong> thành lời nhận xét cá nhân hóa.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Tiến độ duyệt: <strong className="text-indigo-600">{approvedCount}/{students.length}</strong> ({Math.round(approvedCount/students.length*100)}%)
          </div>

          <button
            onClick={handleBatchApproveAll}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            Phê Duyệt Tất Cả Bản Nháp
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Student List (1 col) & Right AI Studio (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col h-[650px]">
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Lọc trạng thái:</span>
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px]">
                <button
                  onClick={() => setFilterApproved('ALL')}
                  className={`px-2 py-0.5 rounded font-semibold ${filterApproved === 'ALL' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterApproved('DRAFT')}
                  className={`px-2 py-0.5 rounded font-semibold ${filterApproved === 'DRAFT' ? 'bg-amber-100 text-amber-800 shadow-xs' : 'text-slate-500'}`}
                >
                  Chờ duyệt
                </button>
                <button
                  onClick={() => setFilterApproved('APPROVED')}
                  className={`px-2 py-0.5 rounded font-semibold ${filterApproved === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 shadow-xs' : 'text-slate-500'}`}
                >
                  Đã duyệt
                </button>
              </div>
            </div>
          </div>

          {/* Student list scrollable */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredStudents.map((st) => {
              const isSelected = st.id === currentStudent?.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-800">{st.name}</span>
                      <span className="text-[10px] text-slate-400">({st.code})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Tổng: <strong className={st.auditedTotal < 0 ? 'text-rose-600' : 'text-indigo-600'}>{st.auditedTotal}đ</strong>
                      {st.auditedGifts > 0 && <span className="ml-1 text-amber-600 font-semibold">• {st.auditedGifts} quà</span>}
                    </div>
                  </div>

                  <div>
                    {st.commentStatus === 'APPROVED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Đã duyệt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Dự thảo AI
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Draft & Teacher Review Studio */}
        {currentStudent && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              {/* Header of selected student */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
                    {currentStudent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-slate-800">{currentStudent.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        Mã: {currentStudent.code}
                      </span>
                      {currentStudent.isExcellent && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                          XUẤT SẮC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentStudent.gender} • Lớp {currentStudent.className} • Phân hiệu 6 Núi Thành
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    currentStudent.commentStatus === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {currentStudent.commentStatus === 'APPROVED' ? '✓ Đã Phê Duyệt' : '⏳ Bản Nháp AI Chờ Duyệt'}
                  </span>
                </div>
              </div>

              {/* Source Evidence Pills (Ghi nhận thi đua gốc) */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                    <FileCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                    Minh chứng rèn luyện tháng 9:
                  </span>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-emerald-600">+{currentStudent.auditedBonus} cộng</span>
                    <span>•</span>
                    <span className="font-bold text-rose-600">-{currentStudent.auditedPenalty} trừ</span>
                    <span>•</span>
                    <span className="font-black text-indigo-700">Tổng: {currentStudent.auditedTotal}đ</span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">
                  "{currentStudent.rawNote || 'Không có ghi chép trừ điểm. Thực hiện nề nếp tốt.'}"
                </div>
              </div>

              {/* AI Prompt / Tone Selector */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-slate-700">Định hướng giọng điệu sư phạm:</span>
                </div>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setTone('ENCOURAGING')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      tone === 'ENCOURAGING' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Khích lệ, động viên (Khuyến nghị)
                  </button>
                  <button
                    onClick={() => setTone('BALANCED')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      tone === 'BALANCED' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Chuẩn mực, khách quan
                  </button>
                  <button
                    onClick={() => setTone('INTERVENTION')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      tone === 'INTERVENTION' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Đề xuất can thiệp & rèn luyện
                  </button>
                </div>

                <button
                  onClick={handleRegenerateDraft}
                  disabled={isRegenerating}
                  className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold border border-purple-200 transition-all"
                >
                  <RotateCcw className={`w-3.5 h-3.5 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                  Tạo lại bản nháp
                </button>
              </div>

              {/* Editor Workspace: Teacher's Comment Box */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center">
                    <Edit3 className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                    Lời nhận xét chính thức của Giáo viên (Bản nháp AI đã nạp):
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Giáo viên có quyền chỉnh sửa 100% trước khi lưu
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={currentStudent.teacherComment}
                  onChange={(e) => handleUpdateTeacherComment(e.target.value)}
                  className="w-full p-3.5 text-xs text-slate-800 bg-slate-50/50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed font-normal"
                  placeholder="Nhập hoặc chỉnh sửa lời nhận xét..."
                />
              </div>

              {/* Pedagogical intervention advice generated by AI */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                <div className="flex items-center space-x-1.5 font-bold mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Gợi ý biện pháp giáo dục từ AI:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {currentStudent.educationalPlan.intervention}
                </p>
                <p className="text-[11px] text-amber-700 mt-1">
                  <strong>Kế hoạch tuần tới:</strong> {currentStudent.educationalPlan.weeklyGoal}
                </p>
              </div>
            </div>

            {/* Bottom Actions for Teacher */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleReject(currentStudent)}
                className="inline-flex items-center px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-all"
              >
                <ThumbsDown className="w-3.5 h-3.5 mr-1.5" />
                Yêu cầu xem xét lại
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onSelectStudent(currentStudent)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all"
                >
                  Xem Hồ sơ chi tiết
                </button>
                <button
                  onClick={() => handleApprove(currentStudent)}
                  className="inline-flex items-center px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
                  Phê Duyệt Lời Nhận Xét Này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
