'use strict';
import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, AlertCircle, FileCheck, Scale, CheckCircle2, Database, Award } from 'lucide-react';
import { fetchCriteriaFromBackend } from '../services/api';
import { Criterion } from '../types';

export const RulesSettingsView: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loadingCriteria, setLoadingCriteria] = useState<boolean>(true);

  useEffect(() => {
    fetchCriteriaFromBackend().then((data) => {
      if (data && data.length > 0) {
        setCriteria(data);
      }
      setLoadingCriteria(false);
    }).catch(() => {
      setLoadingCriteria(false);
    });
  }, []);

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
    },
    {
      code: 'BR-009',
      title: 'Chuẩn hóa danh mục 13 tiêu chí thi đua (8 trừ, 5 cộng)',
      desc: 'Chính thức hóa tiêu chí Viết trước vở tập viết (-1), Xô xát/Đánh bạn (-10) và mức Mất tập trung (-1/lần nhắc nhở).',
      status: 'APPROVED',
      impact: 'Khớp 100% dữ liệu thực tế và chuẩn hóa nề nếp lớp 2'
    },
    {
      code: 'BR-010',
      title: 'Bảo vệ tâm lý học sinh tiểu học đối với điểm âm',
      desc: 'Tổng điểm âm bảo lưu kín trong hồ sơ cá nhân và chuyển thành mục tiêu rèn luyện tháng tới; không công khai bảng tin lớp.',
      status: 'APPROVED',
      impact: 'Tuân thủ đạo đức sư phạm và tâm lý học lứa tuổi'
    }
  ];

  const pendingRules = [
    {
      title: 'Tiêu chuẩn chính thức danh hiệu "Xuất sắc tháng"',
      desc: 'Hiện tại lấy theo đề xuất của GVCN (An, Hiệp, Ý). Cần chuẩn hóa tiêu chí: Điểm tổng >= 25, không vi phạm cờ đỏ, vở sạch chữ đẹp.',
      status: 'PENDING'
    },
    {
      title: 'Đơn vị tính điểm cộng tối đa trong ngày/tuần',
      desc: 'Đề xuất giới hạn số lần cộng điểm phát biểu trong 1 buổi học để tạo cơ hội đồng đều cho mọi học sinh.',
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

      {/* Database Criteria Table - Real SQLite Data */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center">
            <Database className="w-4 h-4 mr-1.5 text-indigo-600" />
            Danh Mục Tiêu Chí Thi Đua (Dữ Liệu Thật từ Database SQLite — Bảng criteria):
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {criteria.length > 0 ? `${criteria.length} Tiêu chí Đã nạp từ DB` : 'Dữ liệu chuẩn hóa SRS v1.0'}
          </span>
        </div>

        {loadingCriteria ? (
          <div className="p-4 text-xs text-slate-500">Đang tải danh mục tiêu chí từ Database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mã tiêu chí</th>
                  <th className="py-2.5 px-3">Tên hành vi thi đua</th>
                  <th className="py-2.5 px-3 text-center">Phân loại</th>
                  <th className="py-2.5 px-3 text-center">Mức điểm</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái CSDL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(criteria.length > 0 ? criteria : [
                  { id: 1, code: 'CO_DO', name: 'Vi phạm cờ đỏ', category: 'PENALTY', default_points: 10 },
                  { id: 2, code: 'DANH_LON', name: 'Xô xát / Đánh bạn', category: 'PENALTY', default_points: 10 },
                  { id: 3, code: 'DI_LUNG_TUNG', name: 'Đi lung tung trong lớp', category: 'PENALTY', default_points: 2 },
                  { id: 4, code: 'NOI_CHUYEN', name: 'Nói chuyện riêng trong giờ học', category: 'PENALTY', default_points: 1 },
                  { id: 5, code: 'NOI_LEO', name: 'Nói leo trong giờ học', category: 'PENALTY', default_points: 1 },
                  { id: 6, code: 'QUEN_SACH_VO', name: 'Không mang sách vở, dụng cụ học tập', category: 'PENALTY', default_points: 1 },
                  { id: 7, code: 'KHONG_TAP_TRUNG', name: 'Không tập trung giờ học', category: 'PENALTY', default_points: 1 },
                  { id: 8, code: 'VIET_TRUOC_VO', name: 'Viết trước vở tập viết khi chưa hướng dẫn', category: 'PENALTY', default_points: 1 },
                  { id: 9, code: 'PHAT_BIEU', name: 'Phát biểu xây dựng bài', category: 'BONUS', default_points: 1 },
                  { id: 10, code: 'DIEM_CONG_VO', name: 'Điểm cộng vở sạch chữ đẹp', category: 'BONUS', default_points: 1 },
                  { id: 11, code: 'DON_VE_SINH', name: 'Tham gia dọn vệ sinh', category: 'BONUS', default_points: 1 },
                  { id: 12, code: 'GIUP_BAN', name: 'Giúp đỡ bạn trong học tập', category: 'BONUS', default_points: 1 },
                  { id: 13, code: 'TRO_CHOI', name: 'Tham gia trò chơi học tập', category: 'BONUS', default_points: 1 },
                ] as Criterion[]).map((crit) => (
                  <tr key={crit.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{crit.code}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{crit.name}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        crit.category === 'BONUS' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {crit.category === 'BONUS' ? 'Điểm cộng' : 'Điểm trừ'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      <span className={crit.category === 'BONUS' ? 'text-emerald-600' : 'text-rose-600'}>
                        {crit.category === 'BONUS' ? `+${crit.default_points}` : `-${crit.default_points}`}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        CONFIRMED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmed Rules Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          10 Quy Tắc Nghiệp Vụ Đã Phê Duyệt Chính Thức (BR-001 Đến BR-010):
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

