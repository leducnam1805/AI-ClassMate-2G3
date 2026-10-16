import json
import os
from .database import engine, Base, SessionLocal
from .models import (
    ClassModel, StudentModel, CriterionModel, MonthlySummaryModel, 
    AICommentModel, ReviewIssueModel
)
from .services.audit_service import calculate_audited_scores, audit_student_data
from .services.ai_service import generate_ai_comment, generate_educational_plan

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(StudentModel).count() > 0:
        print("Database already contains student records.")
        db.close()
        return

    print("Seeding initial data for Class 2G3...")

    # 1. Class
    cls = ClassModel(
        code="2G3-2026",
        name="Lớp 2G3",
        grade_level=2,
        academic_year="2026-2027",
        school_name="Trường Tiểu học Núi Thành (Phân hiệu 6)"
    )
    db.add(cls)
    db.commit()
    db.refresh(cls)

    # 2. Criteria (Chuẩn hóa 13 tiêu chí theo SRS v1.0)
    criteria_list = [
        CriterionModel(code="PHAT_BIEU", name="Phát biểu xây dựng bài", category="BONUS", default_points=1),
        CriterionModel(code="DIEM_CONG_VO", name="Điểm cộng vở sạch chữ đẹp", category="BONUS", default_points=1),
        CriterionModel(code="DON_VE_SINH", name="Tham gia dọn vệ sinh", category="BONUS", default_points=1),
        CriterionModel(code="GIUP_BAN", name="Giúp đỡ bạn trong học tập", category="BONUS", default_points=1),
        CriterionModel(code="TRO_CHOI", name="Tham gia trò chơi học tập", category="BONUS", default_points=1),
        CriterionModel(code="CO_DO", name="Vi phạm cờ đỏ", category="PENALTY", default_points=10),
        CriterionModel(code="DI_LUNG_TUNG", name="Đi lung tung trong lớp", category="PENALTY", default_points=2),
        CriterionModel(code="NOI_CHUYEN", name="Nói chuyện riêng trong giờ học", category="PENALTY", default_points=1),
        CriterionModel(code="NOI_LEO", name="Nói leo trong giờ học", category="PENALTY", default_points=1),
        CriterionModel(code="DANH_LON", name="Xô xát / Đánh bạn", category="PENALTY", default_points=10),
        CriterionModel(code="QUEN_SACH_VO", name="Không mang sách vở, dụng cụ học tập", category="PENALTY", default_points=1),
        CriterionModel(code="KHONG_TAP_TRUNG", name="Không tập trung giờ học", category="PENALTY", default_points=1),
        CriterionModel(code="VIET_TRUOC_VO", name="Viết trước vở tập viết khi chưa hướng dẫn", category="PENALTY", default_points=1),
    ]
    db.add_all(criteria_list)
    db.commit()

    # 3. Raw authentic students from September Excel
    raw_students = [
        {"stt": 1, "code": "HS001", "name": "Đinh Thành An", "gender": "Nam", "b": 28, "p": None, "note": "Điểm cộng vở , phát biểu (28);", "t": 28, "g": 2, "rem": "8", "exc": True},
        {"stt": 2, "code": "HS002", "name": "Lộ Minh Anh", "gender": "Nữ", "b": 8, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng (8)", "t": 5, "g": None, "rem": "5", "exc": False},
        {"stt": 3, "code": "HS003", "name": "Bùi Gia Bảo", "gender": "Nam", "b": 17, "p": 3, "note": "Không tập trung giờ học (-3);  Phát biểu, điểm cộng (17)", "t": 14, "g": 1, "rem": "4", "exc": False},
        {"stt": 4, "code": "HS004", "name": "Phạm Thiên Bảo", "gender": "Nam", "b": 20, "p": None, "note": None, "t": 20, "g": 2, "rem": "0", "exc": False},
        {"stt": 5, "code": "HS005", "name": "Trần Ngô Bảo Diệp", "gender": "Nữ", "b": 11, "p": None, "note": None, "t": 11, "g": 1, "rem": "1", "exc": False},
        {"stt": 6, "code": "HS006", "name": "Lê Châu Duy Hải", "gender": "Nam", "b": 12, "p": 15, "note": "Không tập trung giờ học (-3); Vi phạm cờ đỏ (-5); Đánh bạn (-7);  Phát biểu, điểm cộng (12)", "t": -3, "g": None, "rem": "-3", "exc": False},
        {"stt": 7, "code": "HS007", "name": "Lê Viết Hải", "gender": "Nữ", "b": 17, "p": 4, "note": "Nói chuyện nói leo trong giờ học (-4);  Phát biểu, điểm cộng (17)", "t": 13, "g": 1, "rem": "3", "exc": False},
        {"stt": 8, "code": "HS008", "name": "Phạm Khả Hân", "gender": "Nam", "b": 26, "p": 2, "note": "Nói chuyện trong giờ học (-2); Phát biểu, điểm cộng (26)", "t": 24, "g": 2, "rem": "4", "exc": False},
        {"stt": 9, "code": "HS009", "name": "Lê Ngọc Hiệp", "gender": "Nam", "b": 36, "p": 7, "note": "Vi phạm cờ đỏ (-5); Nói chuyện (-2);  Phát biểu, điểm cộng (36)", "t": 29, "g": 2, "rem": "9", "exc": True},
        {"stt": 10, "code": "HS010", "name": "Nguyễn Bá Đăng Khoa", "gender": "Nữ", "b": 20, "p": 7, "note": "Không tập trung giờ học (-3); Nói chuyện trong giờ học (-3); Viết trước vở tập viết (-1);  Phát biểu, điểm cộng (20)", "t": 13, "g": 1, "rem": "3", "exc": False},
        {"stt": 11, "code": "HS011", "name": "Võ Huỳnh Văn Khoa", "gender": "Nam", "b": 10, "p": 6, "note": "Không tập trung giờ học (-3); Nói chuyện trong giừo học (-3);  Phát biểu, điểm cộng (10)", "t": 4, "g": None, "rem": "4", "exc": False},
        {"stt": 12, "code": "HS012", "name": "Lê Nguyễn Tuấn Kiệt", "gender": "Nam", "b": 27, "p": 3, "note": "Không tập trung giờ học (-3);  Phát biểu, điểm cộng (27)", "t": 24, "g": 2, "rem": "4", "exc": False},
        {"stt": 13, "code": "HS013", "name": "Nguyễn Quốc Hoàng Long", "gender": "Nữ", "b": 2, "p": 10, "note": "Không tập trung giờ học (-3); Đi lung tung trong lớp (-2); Vi phạm cờ đỏ (-5);  Phát biểu, điểm cộng (2)", "t": -8, "g": None, "rem": "-9", "exc": False},
        {"stt": 14, "code": "HS014", "name": "Bùi Bảo Ngọc", "gender": "Nam", "b": 25, "p": 1, "note": "Nói chuyện (-1); Phát biểu, điểm cộng (25)", "t": 24, "g": 2, "rem": "4", "exc": False},
        {"stt": 15, "code": "HS015", "name": "Trịnh Phú Ngọc", "gender": "Nữ", "b": 14, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng (14)", "t": 11, "g": 1, "rem": "1", "exc": False},
        {"stt": 16, "code": "HS016", "name": "Trần Nguyễn Thanh Nhật", "gender": "Nam", "b": None, "p": 15, "note": "Không tập trung giờ học (-3); Vi phạm cờ đỏ (-10); Nói chuyện trong giờ học (-2); Phát biểu, điểm cộng ()", "t": -15, "g": None, "rem": "-15", "exc": False},
        {"stt": 17, "code": "HS017", "name": "Cao Thanh Như", "gender": "Nữ", "b": 8, "p": 8, "note": "Không tập trung giờ học (-3); Nói chuyện (-5); Phát biểu, điểm cộng (8)", "t": 0, "g": None, "rem": "0", "exc": False},
        {"stt": 18, "code": "HS018", "name": "Nguyễn Đức Phát", "gender": "Nam", "b": 23, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng (23)", "t": 20, "g": 2, "rem": "0", "exc": False},
        {"stt": 19, "code": "HS019", "name": "Nguyễn Uy Thiên Phúc", "gender": "Nam", "b": 17, "p": 5, "note": "Nói chuyện, nói leo (-5); Phát biểu, điểm cộng (17)", "t": 12, "g": 1, "rem": "2", "exc": False},
        {"stt": 20, "code": "HS020", "name": "Phạm Nguyễn Nhã Thanh", "gender": "Nữ", "b": 29, "p": 10, "note": "Không tập trung giờ học (-3); Vi phạm cờ đỏ (-5); Nói chuyện (-2); Phát biểu, điểm cộng (29)", "t": 19, "g": 1, "rem": "9", "exc": False},
        {"stt": 21, "code": "HS021", "name": "Nguyễn Hoàng Phương Thảo", "gender": "Nữ", "b": 23, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng (23)", "t": 20, "g": 2, "rem": "0", "exc": False},
        {"stt": 22, "code": "HS022", "name": "Nguyễn Ngọc Minh Thư", "gender": "Nữ", "b": 12, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng (12)", "t": 9, "g": None, "rem": "9", "exc": False},
        {"stt": 23, "code": "HS023", "name": "Nguyễn Quỳnh Thy", "gender": "Nữ", "b": 18, "p": 3, "note": "Không tập trung giờ học (-3); Phát biểu, điểm cộng 18)", "t": 15, "g": 1, "rem": "5", "exc": False},
        {"stt": 24, "code": "HS024", "name": "Lê Minh Trung", "gender": "Nam", "b": 3, "p": 8, "note": "Không tập trung giờ học (-3); Nói chuyện (-5); Phát biểu, điểm cộng (3)", "t": -5, "g": None, "rem": "-5", "exc": False},
        {"stt": 25, "code": "HS025", "name": "Trần Thị Ánh Tuyết", "gender": "Nữ", "b": 19, "p": 5, "note": "Không tập trung giờ học (-3); Nói chuyện (-2);  Phát biểu, điểm cộng (19)", "t": 14, "g": 1, "rem": "4", "exc": False},
        {"stt": 26, "code": "HS026", "name": "Lê Thị Như Ý", "gender": "Nữ", "b": 30, "p": 2, "note": "Phát biểu sôi nổi, điểm cộng chấm vở (30)", "t": 28, "g": 2, "rem": "8", "exc": True},
    ]

    for item in raw_students:
        st = StudentModel(
            class_id=cls.id,
            student_code=item["code"],
            stt=item["stt"],
            full_name=item["name"],
            gender=item["gender"],
            is_excellent=item["exc"]
        )
        db.add(st)
        db.commit()
        db.refresh(st)

        # Audit scores
        aud_b, aud_p, aud_tot, aud_g, aud_rem = calculate_audited_scores(item["b"], item["p"])

        # Monthly summary
        summary = MonthlySummaryModel(
            student_id=st.id,
            month=9,
            year=2026,
            raw_bonus=item["b"],
            raw_penalty=item["p"],
            raw_total=item["t"],
            raw_gifts=item["g"],
            raw_remainder=str(item["rem"]) if item["rem"] is not None else None,
            raw_note=item["note"],
            audited_bonus=aud_b,
            audited_penalty=aud_p,
            audited_total=aud_tot,
            audited_gifts=aud_g,
            audited_remainder=aud_rem,
            status="APPROVED" if item["exc"] else "DRAFT"
        )
        db.add(summary)

        # AI Comment & Plan
        draft = generate_ai_comment(item["name"], aud_tot, aud_b, aud_p, aud_g, item["note"], "ENCOURAGING")
        plan = generate_educational_plan(item["name"], aud_tot, item["note"])
        
        ai_comm = AICommentModel(
            student_id=st.id,
            month=9,
            year=2026,
            draft_comment=draft,
            teacher_comment=draft,
            status="APPROVED" if item["exc"] or aud_tot >= 20 else "DRAFT",
            strength_notes=json.dumps(plan["strengths"], ensure_ascii=False),
            weakness_notes=json.dumps(plan["weaknesses"], ensure_ascii=False),
            intervention_plan=plan["intervention"],
            weekly_goal=plan["weekly_goal"],
            parent_message=plan["parent_message"]
        )
        db.add(ai_comm)

        # Review issues
        issues = audit_student_data(item["stt"], item["code"], item["name"], 
                                    item["b"], item["p"], item["t"], item["g"], 
                                    item["rem"], item["note"])
        for iss in issues:
            r_iss = ReviewIssueModel(
                student_id=st.id,
                rule_code=iss["rule_code"],
                severity=iss["severity"],
                field_name=iss["field_name"],
                description=iss["description"],
                suggestion=iss["suggestion"],
                resolved=iss["resolved"]
            )
            db.add(r_iss)

        db.commit()

    print("Successfully seeded 26 students into SQLite database!")
    db.close()

if __name__ == "__main__":
    seed_database()
