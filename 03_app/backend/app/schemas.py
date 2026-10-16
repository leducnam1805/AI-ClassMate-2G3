from typing import List, Optional
from pydantic import BaseModel

class AuditIssueSchema(BaseModel):
    id: int
    rule_code: str
    severity: str
    field_name: str
    description: str
    suggestion: str
    resolved: bool

    class Config:
        from_attributes = True

class CriterionSchema(BaseModel):
    id: int
    code: str
    name: str
    category: str
    default_points: int
    description: Optional[str] = None
    is_official: bool

    class Config:
        from_attributes = True

class StudentListResponse(BaseModel):
    id: int
    student_code: str
    stt: int
    name: str
    gender: str
    class_name: str
    is_excellent: bool
    
    # Raw Excel
    raw_bonus: Optional[int] = None
    raw_penalty: Optional[int] = None
    raw_total: Optional[int] = None
    raw_gifts: Optional[int] = None
    raw_remainder: Optional[str] = None
    raw_note: Optional[str] = None

    # Audited
    audited_bonus: int
    audited_penalty: int
    audited_total: int
    audited_gifts: int
    audited_remainder: str

    # Status & Comments
    status: str
    issues: List[AuditIssueSchema] = []
    ai_comment_draft: str
    teacher_comment: str
    comment_status: str

    # Educational Plan
    strengths: List[str] = []
    weaknesses: List[str] = []
    intervention: str = ""
    parent_message: str = ""
    weekly_goal: str = ""

    class Config:
        from_attributes = True

class StudentUpdatePayload(BaseModel):
    audited_bonus: Optional[int] = None
    audited_penalty: Optional[int] = None
    teacher_comment: Optional[str] = None
    comment_status: Optional[str] = None

class GenerateDraftRequest(BaseModel):
    student_id: int
    tone: Optional[str] = "ENCOURAGING" # ENCOURAGING / BALANCED / INTERVENTION

class BatchApproveRequest(BaseModel):
    student_ids: Optional[List[int]] = None

class ResolveIssueRequest(BaseModel):
    resolved: bool
