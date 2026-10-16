'use strict';
import React from 'react';
import { Student } from '../types';
import { RESEARCH_METRICS } from '../data/studentsData';
import { fetchResearchMetricsFromBackend } from '../services/api';
import { 
  FileText, 
  Printer, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  Award,
  Layers,
  ArrowDownRight
} from 'lucide-react';

interface ResearchReportViewProps {
  students: Student[];
}

export const ResearchReportView: React.FC<ResearchReportViewProps> = ({ students }) => {
  const [metrics, setMetrics] = React.useState<any>(RESEARCH_METRICS);

  React.useEffect(() => {
    fetchResearchMetricsFromBackend().then((data) => {
      if (data && data.traditional_method) {
        setMetrics({
          traditionalMethod: {
            auditTimeMinutes: data.traditional_method.audit_time_minutes,
            calculationTimeMinutes: data.traditional_method.calculation_time_minutes,
            commentTimeMinutes: data.traditional_method.comment_time_minutes,
            totalTimeMinutes: data.traditional_method.total_time_minutes,
            calculationErrorRate: data.traditional_method.calculation_error_rate,
            evidenceRate: data.traditional_method.evidence_rate,
          },
          aiClassMateMethod: {
            auditTimeMinutes: data.ai_classmate_method.audit_time_minutes,
            calculationTimeMinutes: data.ai_classmate_method.calculation_time_minutes,
            commentTimeMinutes: data.ai_classmate_method.comment_time_minutes,
            totalTimeMinutes: data.ai_classmate_method.total_time_minutes,
            calculationErrorRate: data.ai_classmate_method.calculation_error_rate,
            evidenceRate: data.ai_classmate_method.evidence_rate,
          },
          improvement: {
            timeSavedPercent: data.improvement.time_saved_percent,
            errorReductionPercent: data.improvement.error_reduction_percent,
            evidenceIncreasePercent: data.improvement.evidence_increase_percent,
          }
        });
      }
    }).catch(() => {});
  }, []);

  const trad = metrics.traditionalMethod;
  const modern = metrics.aiClassMateMethod;

  const totalGifts = students.reduce((acc, s) => acc + s.auditedGifts, 0);
  const excellentList = students.filter(s => s.isExcellent);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Print action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              Minh Chứng Thực Nghiệm & Báo Cáo Nghiên Cứu Khoa Học
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Số liệu đối chứng trước và sau khi áp dụng mô hình <strong>AI ClassMate 2G3</strong> tại Lớp 2G3.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          In Báo Cáo Tổng Hợp Tháng 9
        </button>
      </div>

      {/* Quantitative Impact Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Thời gian thực hiện */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tổng thời gian xử lý</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-indigo-700">{modern.totalTimeMinutes} phút</span>
              <span className="text-xs text-slate-400 line-through">440 phút</span>
            </div>
            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-4 h-4 mr-0.5" />
              Tiết kiệm 412 phút (giảm 93.6% thời gian của GV)
            </div>
          </div>
        </div>

        {/* Metric 2: Tỷ lệ sai sót tính toán */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ sai sót tính điểm/quà</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-600">0.0%</span>
              <span className="text-xs text-slate-400 line-through">15.4%</span>
            </div>
            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-0.5" />
              Tuyệt đối chuẩn xác theo bộ quy tắc BR-001..008
            </div>
          </div>
        </div>

        {/* Metric 3: Tính cá nhân hóa nhận xét */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Gắn với minh chứng cụ thể</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-purple-700">100%</span>
              <span className="text-xs text-slate-400 line-through">42.3%</span>
            </div>
            <div className="mt-2 text-xs font-bold text-purple-600 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-0.5" />
              26/26 học sinh có lời nhận xét riêng biệt
            </div>
          </div>
        </div>
      </div>

      {/* Experimental Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-indigo-600" />
          Bảng Đối Chứng Thực Nghiệm Giữa Hai Phương Pháp
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-4 py-3">Tiêu chí đánh giá</th>
                <th className="px-4 py-3 text-slate-500">Phương pháp thủ công (Excel cũ)</th>
                <th className="px-4 py-3 text-indigo-700 bg-indigo-50/50">Mô hình AI ClassMate 2G3</th>
                <th className="px-4 py-3 text-emerald-700 text-right">Hiệu quả cải thiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-800">1. Rà soát lỗi dữ liệu đầu vào</td>
                <td className="px-4 py-3.5 text-slate-600">Mất 120 phút dò tay từng ô; dễ bỏ sót ô trống.</td>
                <td className="px-4 py-3.5 bg-indigo-50/20 text-indigo-900 font-semibold">Tự động phát hiện 7 lỗi trong 2 phút (BR-001..008).</td>
                <td className="px-4 py-3.5 text-emerald-600 font-bold text-right">Nhanh hơn 60 lần</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-800">2. Tính điểm, quà và điểm dư</td>
                <td className="px-4 py-3.5 text-slate-600">Sai sót 4 trường hợp (HS013 ghi sai dư, HS016 trống điểm).</td>
                <td className="px-4 py-3.5 bg-indigo-50/20 text-indigo-900 font-semibold">Công thức Floor(Tổng/10), điểm âm gán N/A chuẩn xác 100%.</td>
                <td className="px-4 py-3.5 text-emerald-600 font-bold text-right">Triệt tiêu 100% lỗi</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-800">3. Soạn nhận xét cuối tháng</td>
                <td className="px-4 py-3.5 text-slate-600">Mất ~260 phút (10 phút/em); nhận xét dễ lặp lại khuôn mẫu.</td>
                <td className="px-4 py-3.5 bg-indigo-50/20 text-indigo-900 font-semibold">AI dự thảo tức thì; GV xem và duyệt 1 phút/em (tổng 25 phút).</td>
                <td className="px-4 py-3.5 text-emerald-600 font-bold text-right">Tiết kiệm 90.4% giờ</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-800">4. Kế hoạch hỗ trợ học sinh cá nhân</td>
                <td className="px-4 py-3.5 text-slate-600">Không có công cụ lưu vết; chỉ nhớ trong đầu.</td>
                <td className="px-4 py-3.5 bg-indigo-50/20 text-indigo-900 font-semibold">Tự động gợi ý mục tiêu tuần và biện pháp can thiệp cho từng em.</td>
                <td className="px-4 py-3.5 text-emerald-600 font-bold text-right">Có hệ thống & lưu vết</td>
              </tr>
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-800">5. Mẫu tin nhắn phối hợp phụ huynh</td>
                <td className="px-4 py-3.5 text-slate-600">Giáo viên tự gõ từng tin nhắn, dễ gây áp lực nếu con bị điểm trừ.</td>
                <td className="px-4 py-3.5 bg-indigo-50/20 text-indigo-900 font-semibold">Mẫu tin nhắn tích cực, tôn trọng, hướng tới giải pháp đồng hành.</td>
                <td className="px-4 py-3.5 text-emerald-600 font-bold text-right">Chuẩn mực sư phạm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Report Section (Ẩn hiện khi in) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 print:border-none print:p-0">
        <div className="text-center space-y-1 pb-4 border-b border-slate-200">
          <div className="text-xs uppercase font-bold text-slate-500">UBND XÃ NÚI THÀNH • TRƯỜNG TIỂU HỌC NÚI THÀNH</div>
          <h2 className="text-lg font-black text-slate-900 uppercase">
            BÁO CÁO TỔNG KẾT THI ĐUA VÀ KẾT QUẢ RÈN LUYỆN LỚP 2G3
          </h2>
          <div className="text-xs text-slate-600 italic">Tháng 9 năm học 2026 - 2027</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>Sĩ số: <strong>26 học sinh</strong></div>
          <div>Tổng phần quà phát: <strong>{totalGifts} phần quà</strong></div>
          <div>Học sinh xuất sắc: <strong>{excellentList.length} em</strong></div>
          <div>Học sinh tiến bộ: <strong>100%</strong></div>
        </div>

        {/* Honor list */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-1.5 text-amber-600" />
            Học sinh Xuất sắc tháng 9 được khen thưởng:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {excellentList.map(st => (
              <div key={st.id} className="p-2 rounded bg-white border border-slate-200">
                <span className="font-bold">{st.name}</span> ({st.code}): {st.auditedTotal}đ — {st.auditedGifts} quà
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Signature Line */}
        <div className="pt-8 flex justify-between text-xs text-slate-700">
          <div className="text-center">
            <p className="font-bold">BAN GIÁM HIỆU PHÊ DUYỆT</p>
            <div className="h-16" />
            <p className="italic text-slate-400">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="text-center">
            <p className="italic">Núi Thành, ngày 30 tháng 09 năm 2026</p>
            <p className="font-bold mt-1">GIÁO VIÊN CHỦ NHIỆM LỚP 2G3</p>
            <div className="h-16" />
            <p className="font-semibold text-slate-800">Thầy/Cô Chủ Nhiệm</p>
          </div>
        </div>
      </div>
    </div>
  );
};
