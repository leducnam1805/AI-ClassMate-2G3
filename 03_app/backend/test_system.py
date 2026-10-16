"""
Unit tests for AI ClassMate 2G3 Backend
Kiểm thử các nghiệp vụ tính điểm thi đua (BR-001..008), kiểm toán lỗi và tạo kế hoạch giáo dục.
"""
import unittest
from app.services.audit_service import calculate_audited_scores, audit_student_data
from app.services.ai_service import generate_ai_comment, generate_educational_plan


class TestAuditCalculation(unittest.TestCase):
    """Kiểm thử tính toán điểm thi đua và quy đổi quà, điểm dư (BR-001, BR-003, BR-005, BR-006)"""

    def test_br005_br006_standard_score(self):
        """Học sinh có điểm dương: quà = floor(total / 10), điểm dư = total % 10"""
        bonus, penalty, total, gifts, remainder = calculate_audited_scores(28, 0)
        self.assertEqual(bonus, 28)
        self.assertEqual(penalty, 0)
        self.assertEqual(total, 28)
        self.assertEqual(gifts, 2)
        self.assertEqual(remainder, "8")

    def test_br003_negative_score(self):
        """BR-003: Điểm âm (total < 0) => số quà = 0, điểm dư = 'N/A'"""
        bonus, penalty, total, gifts, remainder = calculate_audited_scores(2, 10)
        self.assertEqual(bonus, 2)
        self.assertEqual(penalty, 10)
        self.assertEqual(total, -8)
        self.assertEqual(gifts, 0)
        self.assertEqual(remainder, "N/A")

    def test_br001_blank_or_none_score(self):
        """BR-001: Ô điểm None hoặc chuỗi rỗng được chuẩn hóa về 0"""
        bonus, penalty, total, gifts, remainder = calculate_audited_scores(None, "")
        self.assertEqual(bonus, 0)
        self.assertEqual(penalty, 0)
        self.assertEqual(total, 0)
        self.assertEqual(gifts, 0)
        self.assertEqual(remainder, "0")

    def test_zero_total_score(self):
        """Tổng điểm bằng 0: quà = 0, điểm dư = '0'"""
        bonus, penalty, total, gifts, remainder = calculate_audited_scores(5, 5)
        self.assertEqual(total, 0)
        self.assertEqual(gifts, 0)
        self.assertEqual(remainder, "0")


class TestAuditDataRules(unittest.TestCase):
    """Kiểm thử phát hiện lỗi dữ liệu & quy tắc kiểm toán (BR-001, BR-002, BR-003, BR-007)"""

    def test_br001_blank_bonus_detected(self):
        """Phát hiện lỗi BLOCKING khi ô điểm cộng bị để trống"""
        issues = audit_student_data(
            stt=1, code="HS001", name="Nguyễn Văn A",
            raw_bonus=None, raw_penalty=0, raw_total=None,
            raw_gifts=None, raw_remainder=None, raw_note="Có phát biểu"
        )
        codes = [iss["rule_code"] for iss in issues]
        self.assertIn("BR-001", codes)
        blocking_issues = [iss for iss in issues if iss["severity"] == "BLOCKING"]
        self.assertTrue(len(blocking_issues) > 0)

    def test_br002_flag_violation_inconsistency(self):
        """BR-002: Phát hiện cảnh báo cờ đỏ bị ghi sai mức điểm (-5 thay vì -10)"""
        issues = audit_student_data(
            stt=2, code="HS002", name="Trần Thị B",
            raw_bonus=10, raw_penalty=5, raw_total=5,
            raw_gifts=0, raw_remainder="5", raw_note="Cờ đỏ nhắc nhở (-5)"
        )
        codes = [iss["rule_code"] for iss in issues]
        self.assertIn("BR-002", codes)

    def test_br003_negative_total_issue(self):
        """BR-003: Phát hiện cảnh báo khi tổng điểm thi đua âm"""
        issues = audit_student_data(
            stt=13, code="HS013", name="Lê Hoàng C",
            raw_bonus=2, raw_penalty=10, raw_total=-8,
            raw_gifts=0, raw_remainder="-9", raw_note="Hay mất trật tự"
        )
        codes = [iss["rule_code"] for iss in issues]
        self.assertIn("BR-003", codes)


class TestAiService(unittest.TestCase):
    """Kiểm thử tính năng sinh nhận xét và kế hoạch can thiệp giáo dục"""

    def test_generate_ai_comment_encouraging_high_score(self):
        """Sinh nhận xét khen ngợi cho học sinh xuất sắc (total >= 25)"""
        comment = generate_ai_comment("Đinh Thành An", 28, 28, 0, 2, "Phát biểu tích cực", tone="ENCOURAGING")
        self.assertIn("Đinh Thành An", comment)
        self.assertIn("xuất sắc", comment.lower())
        self.assertIn("2", comment)

    def test_generate_ai_comment_negative_score(self):
        """Sinh nhận xét khích lệ, sư phạm tích cực khi điểm âm (không trách mắng)"""
        comment = generate_ai_comment("Lê Hoàng C", -8, 2, 10, 0, "Hay nói chuyện", tone="ENCOURAGING")
        self.assertIn("Lê Hoàng C", comment)
        self.assertTrue(len(comment) > 20)

    def test_generate_educational_plan(self):
        """Sinh kế hoạch giáo dục đầy đủ 5 thành phần cho học sinh"""
        plan = generate_educational_plan("Lê Hoàng C", -8, "Hay nói chuyện, nói leo")
        self.assertIn("strengths", plan)
        self.assertIn("weaknesses", plan)
        self.assertIn("intervention", plan)
        self.assertIn("weekly_goal", plan)
        self.assertIn("parent_message", plan)
        self.assertTrue(len(plan["strengths"]) > 0)


if __name__ == "__main__":
    unittest.main()
