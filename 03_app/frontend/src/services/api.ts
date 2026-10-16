import { Student, AuditIssue } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchStudentsFromBackend(): Promise<Student[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/students`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend returned error');
    const data = await res.json();
    
    // Map backend response to frontend Student model
    return data.map((item: any) => ({
      id: String(item.id),
      code: item.student_code,
      stt: item.stt,
      name: item.name,
      gender: item.gender,
      className: item.class_name,
      rawBonus: item.raw_bonus,
      rawPenalty: item.raw_penalty,
      rawNote: item.raw_note,
      rawTotal: item.raw_total,
      rawGifts: item.raw_gifts,
      rawRemainder: item.raw_remainder,
      auditedBonus: item.audited_bonus,
      auditedPenalty: item.audited_penalty,
      auditedTotal: item.audited_total,
      auditedGifts: item.audited_gifts,
      auditedRemainder: item.audited_remainder,
      status: item.status,
      isExcellent: item.is_excellent,
      issues: item.issues.map((iss: any) => ({
        id: String(iss.id),
        code: iss.rule_code,
        severity: iss.severity,
        field: iss.field_name,
        ruleRef: iss.rule_code,
        description: iss.description,
        suggestion: iss.suggestion,
        resolved: iss.resolved
      })),
      aiCommentDraft: item.ai_comment_draft,
      teacherComment: item.teacher_comment,
      commentStatus: item.comment_status,
      educationalPlan: {
        strength: item.strengths || [],
        weakness: item.weaknesses || [],
        intervention: item.intervention || '',
        parentCommunication: item.parent_message || '',
        weeklyGoal: item.weekly_goal || ''
      }
    }));
  } catch (error) {
    console.warn('Backend fetch failed, falling back to local data:', error);
    throw error;
  }
}

export async function updateStudentInBackend(studentId: string, payload: {
  audited_bonus?: number;
  audited_penalty?: number;
  teacher_comment?: string;
  comment_status?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update student in backend', err);
  }
}

export async function regenerateDraftInBackend(studentId: string, tone: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/generate-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: Number(studentId), tone })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to regenerate draft in backend', err);
  }
}

export async function batchApproveInBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/batch-approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    console.error('Failed batch approve in backend', err);
  }
}

export async function resolveIssueInBackend(issueId: string, resolved: boolean) {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/issues/${issueId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolved })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to resolve issue in backend', err);
  }
}

export async function fetchCriteriaFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/criteria`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend criteria returned error');
    return await res.json();
  } catch (err) {
    console.warn('Backend criteria fetch failed:', err);
    return null;
  }
}

export async function fetchResearchMetricsFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/research-metrics`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend metrics returned error');
    return await res.json();
  } catch (err) {
    console.warn('Backend metrics fetch failed:', err);
    return null;
  }
}
