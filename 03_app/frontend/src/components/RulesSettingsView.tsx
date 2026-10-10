'use strict';
import React from 'react';
import { Settings, ShieldCheck, AlertCircle, FileCheck, Scale, CheckCircle2 } from 'lucide-react';

export const RulesSettingsView: React.FC = () => {
  const confirmedRules = [
    {
      code: 'BR-001',
      title: 'Ô điểm bị trống phải được rà soát',
      desc: 'Ô điểm trống là dữ liệu chưa xác nhận, không được tự động coi là 0. Hệ thống hiển thị cảnh báo để giáo viên xác minh.',
      status: 'APPROVED',
      impact: 'Tránh bỏ sót điểm của học sinh (như trường hợp HS016)'
    },
    {
      code: 'BR-002',
      title: 'Vi phạm cờ đỏ trừ 10 điểm',
      desc: 'Một bản ghi vi phạm cờ đỏ hợp lệ áp dụng mức trừ 10 điểm theo quy chế thi đua nhà trường. Nếu dữ liệu cũ ghi -5, hệ thống sẽ cảnh báo.',
      status: 'APPROVED',
      impact: 'Đảm bảo sự thống nhất với quy chế thi đua toàn trường'
    },
    {
      code: 'BR-003',
      title: 'Tổng điểm âm thì không có quà (Điểm dư gán N/A)',
      desc: 'Nếu tổng điểm < 0: Số quà = 0, giữ nguyên tổng điểm âm để theo dõi rèn luyện, điểm dư không tính (hiển thị N/A). Tuyệt đối không tính phép chia dư âm.',
      status: 'APPROVED',
      impact: 'Sửa lỗi sai phép tính của Excel cũ (HS013 ghi dư -9)'
    },
    {
      code: 'BR-004',
      title: 'Không tự sửa dữ liệu nguồn',
      desc: 'Hệ thống giữ nguyên dữ liệu gốc để truy vết; mọi điều chỉnh phải có sự xác nhận của giáo viên chủ nhiệm và lưu vết audit.',
      status: 'APPROVED',
      impact: 'Bảo toàn tính minh bạch và khách quan trong nghiên cứu'
    },
    {
      code: 'BR-005',
      title: 'Công thức tính quà khi tổng điểm không âm',
      desc: 'Số quà = FLOOR(Tổng điểm / 10). Cứ đủ 10 điểm thi đua được 1 món quà.',
      status: 'APPROVED',
      impact: 'Tự động tính đúng số quà cho 19/26 học sinh'
    },
    {
      code: 'BR-006',
      title: 'Công thức tính điểm dư khi tổng điểm không âm',
      desc: 'Điểm dư = Tổng điểm - (Số quà × 10). Ví dụ: 28 điểm = 2 quà, dư 8 điểm.',
      status: 'APPROVED',
      impact: 'Lưu điểm dư để cộng dồn sang tháng 10'
    },
    {
      code: 'BR-007',
      title: 'Nói chuyện và nói leo trong cùng một lần ghi nhận',
      desc: 'Tổng mức trừ là 2 điểm: -1 điểm cho nói chuyện và -1 điểm cho nói leo. Nếu gộp -4 hoặc -5 thì cần rà soát lại số lần.',
      status: 'APPROVED',
      impact: 'Chuẩn hóa cách ghi nhận sự việc sư phạm'
    },
    {
      code: 'BR-008',
      title: 'Không tính trùng cùng một hành vi trong cùng lần ghi nhận',
      desc: 'Hệ thống phát hiện và cảnh báo bản ghi nghi trùng lặp, không tự xóa khi chưa có xác nhận.',
      status: 'APPROVED',
      impact: 'Bảo vệ quyền lợi của học sinh'
    }
  ];

  const pendingRules = [
    {
      title: 'Phân loại mức độ hành vi "Không tập trung giờ học"',
      desc: 'Quy định ghi -1 điểm, nhưng trong Excel tháng 9 ghi -3 điểm. Đề xuất: Phân biệt giữa mất tập trung nhắc nhở (-1) và cố tình gây phân tâm (-3).',
      status: 'PENDING'
    },
    {
      title: 'Tiêu chuẩn chính thức danh hiệu "Xuất sắc tháng"',
      desc: 'Hiện tại lấy theo đề xuất của GVCN (An, Hiệp, Ý). Cần chuẩn hóa tiêu chí: Điểm tổng >= 25, không vi phạm cờ đỏ, vở sạch chữ đẹp.',
      status: 'PENDING'
    },
    {
      title: 'Chính thức hóa tiêu chí "Viết trước vở tập viết"',
      desc: 'Trong Excel ghi -1 điểm nhưng chưa có trong văn bản quy chế ban đầu.',
      status: 'PENDING'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Scale className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Cơ Sở Quy Tắc Nghiệp Vụ (Business Rules Engine)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Được trích xuất từ tài liệu <strong>AI_ClassMate_2G3_Quy_Tac_Nghiep_Vu_v1_final.md</strong> đã được GVCN xác nhận.
          </p>
        </div>
      </div>

      {/* Confirmed Rules Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          8 Quy Tắc Đã Phê Duyệt Chính Thức (BR-001 Đến BR-008):
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {confirmedRules.map((r) => (
            <div key={r.code} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-indigo-100 text-indigo-800">
                    {r.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ ĐÃ ÁP DỤNG
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-indigo-600 font-medium">
                🎯 Ý nghĩa: {r.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending / Research Questions Rules */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5 text-amber-500" />
          Các Quy Tắc Đang Khảo Sát Mở Rộng (Nghiên Cứu Giai Đoạn 2):
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingRules.map((pr, i) => (
            <div key={i} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 shadow-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                PENDING DECISION
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">{pr.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {pr.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
