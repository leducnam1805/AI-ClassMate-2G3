export type Gender = 'Nam' | 'Nữ';

export type IssueSeverity = 'BLOCKING' | 'WARNING' | 'INFO';

export interface AuditIssue {
  id: string;
  code: string;
  field: string;
  severity: IssueSeverity;
  ruleRef: string; // e.g. "BR-001", "BR-003"
  description: string;
  suggestion: string;
  resolved: boolean;
}

export interface Student {
  id: string;
  code: string; // HS001 -> HS026
  stt: number;
  name: string;
  gender: Gender;
  className: string;
  
  // Dữ liệu nguồn từ Excel
  rawBonus: number | null;
  rawPenalty: number | null;
  rawNote: string | null;
  rawTotal: number | null;
  rawGifts: number | null;
  rawRemainder: string | null;

  // Dữ liệu sau khi chuẩn hóa qua Engine nghiệp vụ
  auditedBonus: number;
  auditedPenalty: number;
  auditedTotal: number;
  auditedGifts: number;
  auditedRemainder: string; // "8" or "N/A"

  // Đánh giá và lỗi phát hiện
  issues: AuditIssue[];
  status: 'VALID' | 'HAS_WARNING' | 'NEEDS_REVIEW';
  isExcellent: boolean; // Có trong danh sách Xuất sắc tháng 9 không

  // Nhận xét & AI Assistant
  aiCommentDraft: string;
  teacherComment: string;
  commentStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  educationalPlan: {
    strength: string[];
    weakness: string[];
    intervention: string;
    parentCommunication: string;
    weeklyGoal: string;
  };
}

export interface SummaryStats {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  giftReceiversCount: number;
  totalGiftsAwarded: number;
  negativeScoreCount: number;
  issuesCount: number;
  resolvedIssuesCount: number;
  approvedCommentsCount: number;
  timeSavedMinutes: number;
}

export interface Criterion {
  id: number;
  code: string;
  name: string;
  category: 'BONUS' | 'PENALTY';
  default_points: number;
  description?: string;
  is_official: boolean;
}
