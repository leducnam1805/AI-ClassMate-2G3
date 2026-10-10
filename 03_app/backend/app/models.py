import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class ClassModel(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    grade_level = Column(Integer, nullable=False, default=2)
    academic_year = Column(String(20), nullable=False, default="2026-2027")
    school_name = Column(String(150), default="Trường TH Núi Thành")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    students = relationship("StudentModel", back_populates="class_rel")


class StudentModel(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. HS001
    stt = Column(Integer, nullable=False)
    full_name = Column(String(100), nullable=False)
    gender = Column(String(10), nullable=False) # 'Nam' / 'Nữ'
    status = Column(String(20), default="ACTIVE")
    is_excellent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    class_rel = relationship("ClassModel", back_populates="students")
    events = relationship("BehaviorEventModel", back_populates="student")
    summaries = relationship("MonthlySummaryModel", back_populates="student")
    ai_comments = relationship("AICommentModel", back_populates="student")
    issues = relationship("ReviewIssueModel", back_populates="student")


class CriterionModel(Base):
    __tablename__ = "criteria"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(20), nullable=False) # 'BONUS' or 'PENALTY'
    default_points = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    is_official = Column(Boolean, default=True) # BR confirmed or pending
    status = Column(String(20), default="APPROVED")


class BehaviorEventModel(Base):
    __tablename__ = "behavior_events"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    criterion_code = Column(String(50), nullable=True)
    event_date = Column(String(20), nullable=False)
    points = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="CONFIRMED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentModel", back_populates="events")


class MonthlySummaryModel(Base):
    __tablename__ = "monthly_summaries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    month = Column(Integer, nullable=False, default=9)
    year = Column(Integer, nullable=False, default=2026)
    
    # Dữ liệu gốc
    raw_bonus = Column(Integer, nullable=True)
    raw_penalty = Column(Integer, nullable=True)
    raw_total = Column(Integer, nullable=True)
    raw_gifts = Column(Integer, nullable=True)
    raw_remainder = Column(String(20), nullable=True)
    raw_note = Column(Text, nullable=True)

    # Dữ liệu chuẩn hóa theo BR-001..008
    audited_bonus = Column(Integer, nullable=False, default=0)
    audited_penalty = Column(Integer, nullable=False, default=0)
    audited_total = Column(Integer, nullable=False, default=0)
    audited_gifts = Column(Integer, nullable=False, default=0)
    audited_remainder = Column(String(20), nullable=False, default="0")
    
    status = Column(String(20), default="DRAFT") # DRAFT / APPROVED / LOCKED
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentModel", back_populates="summaries")


class AICommentModel(Base):
    __tablename__ = "ai_comments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    month = Column(Integer, nullable=False, default=9)
    year = Column(Integer, nullable=False, default=2026)
    
    draft_comment = Column(Text, nullable=False)
    teacher_comment = Column(Text, nullable=False)
    status = Column(String(20), default="DRAFT") # DRAFT / APPROVED / REJECTED
    
    strength_notes = Column(Text, nullable=True)
    weakness_notes = Column(Text, nullable=True)
    intervention_plan = Column(Text, nullable=True)
    weekly_goal = Column(Text, nullable=True)
    parent_message = Column(Text, nullable=True)

    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentModel", back_populates="ai_comments")


class ReviewIssueModel(Base):
    __tablename__ = "review_issues"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    rule_code = Column(String(20), nullable=False) # e.g. BR-001, BR-003
    severity = Column(String(20), nullable=False) # BLOCKING / WARNING / INFO
    field_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=False)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentModel", back_populates="issues")


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(50), nullable=False)
    entity_name = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
