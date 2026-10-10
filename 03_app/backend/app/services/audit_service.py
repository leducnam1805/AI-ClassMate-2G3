import math
from typing import Dict, Any, List, Tuple

def calculate_audited_scores(raw_bonus: Any, raw_penalty: Any) -> Tuple[int, int, int, int, str]:
    """
    Calculates audited score, gifts, remainder according to BR-001..008.
    - BR-001: Blank scores must be audited.
    - BR-003: Negative scores => gifts = 0, remainder = 'N/A'.
    - BR-005: Total >= 0 => gifts = FLOOR(Total / 10).
    - BR-006: Total >= 0 => remainder = Total - (gifts * 10).
    """
    b = int(raw_bonus) if raw_bonus is not None and str(raw_bonus).strip() != '' else 0
    p = int(raw_penalty) if raw_penalty is not None and str(raw_penalty).strip() != '' else 0
    total = b - p

    if total < 0:
        gifts = 0
        remainder = "N/A"
    else:
        gifts = math.floor(total / 10)
        remainder = str(total - (gifts * 10))

    return b, p, total, gifts, remainder

def audit_student_data(stt: int, code: str, name: str, raw_bonus: Any, raw_penalty: Any, 
                       raw_total: Any, raw_gifts: Any, raw_remainder: Any, raw_note: str) -> List[Dict[str, Any]]:
    """
    Scans for inconsistencies according to rules BR-001..BR-008 and returns issues.
    """
    issues = []
    
    # BR-001: Blank bonus score
    if raw_bonus is None or str(raw_bonus).strip() == '':
        issues.append({
            "rule_code": "BR-001",
            "severity": "BLOCKING",
            "field_name": "raw_bonus",
            "description": f"Học sinh {name} ({code}) có ô điểm cộng để trống nhưng nhận xét ghi nhận hoạt động.",
            "suggestion": "Xác minh điểm cộng bị sót hay thực tế bằng 0.",
            "resolved": False
        })

    # BR-001: Blank penalty score
    if raw_penalty is None or str(raw_penalty).strip() == '':
        issues.append({
            "rule_code": "BR-001",
            "severity": "INFO",
            "field_name": "raw_penalty",
            "description": f"Ô điểm trừ để trống trong Excel.",
            "suggestion": "Xác nhận học sinh không có vi phạm điểm trừ nào trong tháng.",
            "resolved": True
        })

    # BR-002: Flag violation score inconsistency (-5 vs -10)
    note_lower = (raw_note or "").lower()
    if "cờ đỏ" in note_lower and raw_penalty is not None:
        if "(-5)" in note_lower or "-5" in note_lower:
            issues.append({
                "rule_code": "BR-002",
                "severity": "WARNING",
                "field_name": "raw_penalty",
                "description": "Vi phạm cờ đỏ ghi trừ 5 điểm thay vì mức -10 theo quy chế trường.",
                "suggestion": "Thống nhất áp dụng mức -10 hoặc xác minh hình thức vi phạm.",
                "resolved": False
            })

    # BR-003: Negative total score
    b, p, calc_total, calc_gifts, calc_rem = calculate_audited_scores(raw_bonus, raw_penalty)
    if calc_total < 0:
        issues.append({
            "rule_code": "BR-003",
            "severity": "BLOCKING",
            "field_name": "audited_total",
            "description": f"Tổng điểm thi đua âm ({calc_total} điểm). Cần chuyển điểm dư sang N/A và lập kế hoạch hỗ trợ.",
            "suggestion": "Áp dụng BR-003: Số quà = 0, Điểm dư = N/A.",
            "resolved": True
        })

    # Excel Formula mismatch (e.g. HS013 raw_total -8 vs raw_remainder -9)
    if raw_total is not None and raw_remainder is not None:
        try:
            if int(raw_total) < 0 and str(raw_remainder).strip() not in ["N/A", str(raw_total)]:
                issues.append({
                    "rule_code": "BR-003",
                    "severity": "BLOCKING",
                    "field_name": "raw_remainder",
                    "description": f"Lỗi lệch phép tính Excel: Tổng điểm {raw_total} nhưng ghi điểm dư {raw_remainder}.",
                    "suggestion": "Sửa lỗi tính toán sai của Excel nguồn. Chuẩn hóa thành N/A.",
                    "resolved": True
                })
        except ValueError:
            pass

    # BR-005: Blank gift cell when total < 10
    if (raw_gifts is None or str(raw_gifts).strip() == '') and calc_total >= 0 and calc_total < 10:
        issues.append({
            "rule_code": "BR-005",
            "severity": "INFO",
            "field_name": "raw_gifts",
            "description": "Tổng điểm nhỏ hơn 10 nhưng ô số lượng quà bị để trống trong Excel thay vì ghi 0.",
            "suggestion": "Quy chuẩn thành 0 quà.",
            "resolved": True
        })

    # BR-007: Combined behaviors (nói chuyện & nói leo)
    if "nói chuyện" in note_lower and "nói leo" in note_lower and ("-4" in note_lower or "-5" in note_lower):
        issues.append({
            "rule_code": "BR-007",
            "severity": "WARNING",
            "field_name": "raw_note",
            "description": "Hành vi nói chuyện và nói leo bị gộp thành mức trừ cao. Cần tách minh chứng cụ thể.",
            "suggestion": "Áp dụng BR-007: Mỗi lần nói chuyện + nói leo trừ 2 điểm (-1 & -1).",
            "resolved": True
        })

    return issues
