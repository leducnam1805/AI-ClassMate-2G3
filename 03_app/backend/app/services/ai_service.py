from typing import Dict, Any, List

def generate_ai_comment(student_name: str, total_score: int, bonus_score: int, 
                        penalty_score: int, gifts: int, raw_note: str, 
                        tone: str = "ENCOURAGING") -> str:
    """
    Simulates / integrates LLM prompt generation for primary school report cards.
    Ensures ethical pedagogical standards: positive encouragement, evidence-based, actionable.
    """
    note = raw_note or ""
    
    if tone == "ENCOURAGING":
        if total_score >= 25:
            return (
                f"Em {student_name} có một tháng học tập rất xuất sắc! "
                f"Em luôn tích cực phát biểu xây dựng bài ({bonus_score} điểm cộng) và đạt danh hiệu Học sinh Xuất sắc tháng 9 với {gifts} món quà thi đua. "
                f"Thầy/cô rất tự hào và mong em tiếp tục giữ vững niềm say mê học tập trong tháng 10!"
            )
        elif total_score >= 10:
            return (
                f"Em {student_name} chăm ngoan, hăng hái tham gia bài học ({bonus_score} điểm cộng) và xứng đáng nhận {gifts} phần quà thi đua. "
                f"Em cần chú ý rèn thêm tính kiên trì và tập trung khi làm bài độc lập để kết quả học tập thêm hoàn thiện nhé!"
            )
        elif total_score >= 0:
            return (
                f"Em {student_name} có nhiều tiến bộ trong việc giơ tay phát biểu bài ({bonus_score} điểm cộng). "
                f"Em cần chú ý nề nếp trật tự, tập trung nghe giảng hơn để tích lũy thêm nhiều phần quà thi đua trong tháng 10. Thầy cô luôn tin tưởng ở em!"
            )
        else:
            return (
                f"Em {student_name} đã bắt đầu có cố gắng trong việc tham gia phát biểu bài ({bonus_score} điểm cộng). "
                f"Dù còn một số biểu hiện cần rèn nề nếp, thầy cô tin rằng với sự đồng hành của gia đình và sự kiên nhẫn của bản thân, em sẽ có nhiều tiến bộ tích cực trong tháng tới!"
            )
            
    elif tone == "BALANCED":
        return (
            f"Đánh giá rèn luyện tháng 9: Em {student_name} đạt tổng điểm thi đua {total_score} điểm "
            f"(+{bonus_score} điểm cộng, -{penalty_score} điểm trừ), nhận {gifts} món quà. "
            f"Em tiếp thu bài khá tốt. Cần nghiêm túc khắc phục các lỗi nề nếp đã được nhắc nhở để hoàn thiện bản thân hơn."
        )
    else: # INTERVENTION
        return (
            f"Kế hoạch rèn luyện tháng 10 cho {student_name}: Phát huy điểm mạnh về phát biểu bài. "
            f"Tập trung khắc phục triệt để các hành vi: {note or 'chưa tập trung, nói chuyện riêng'}. "
            f"Giáo viên chủ nhiệm phối hợp cùng phụ huynh theo dõi sát sao từng tuần."
        )

def generate_educational_plan(student_name: str, total_score: int, raw_note: str) -> Dict[str, Any]:
    """
    Produces structured intervention plan for the student.
    """
    note = (raw_note or "").lower()
    
    strengths = ["Chăm ngoan", "Có ý thức giơ tay phát biểu"]
    weaknesses = []
    
    if "vở" in note:
        strengths.append("Giữ gìn vở sạch chữ đẹp")
    if "xuất sắc" in note or total_score >= 25:
        strengths.append("Gương mẫu trong mọi hoạt động")
        
    if "không tập trung" in note:
        weaknesses.append("Dễ mất tập trung khi làm bài độc lập")
    if "nói chuyện" in note:
        weaknesses.append("Hay nói chuyện riêng trong giờ")
    if "nói leo" in note:
        weaknesses.append("Buột miệng nói leo khi chưa xin phép")
    if "cờ đỏ" in note:
        weaknesses.append("Vi phạm nề nếp xếp hàng cờ đỏ")
    if "đánh bạn" in note:
        weaknesses.append("Còn xô xát, tranh cãi với bạn bè")
    if "đi lung tung" in note:
        weaknesses.append("Đi lại tự do trong lớp")
        
    if not weaknesses:
        weaknesses = ["Đôi khi còn phân tâm ở tiết học muộn"]
        
    intervention = f"Giáo viên quan sát sát sao, nhắc nhở nhẹ nhàng và giao nhiệm vụ học tập vừa sức để khích lệ sự tự giác của {student_name}."
    if total_score < 0:
        intervention = f"Hẹn gặp phụ huynh phối hợp rèn thói quen ngồi yên và kiểm soát cảm xúc; giáo viên chấm điểm rèn luyện theo từng buổi học cho {student_name}."
        
    weekly_goal = f"Không bị nhắc nhở về nề nếp và giơ tay phát biểu ít nhất 3 lần mỗi ngày trong tuần 1 tháng 10."
    parent_msg = f"Kính gửi phụ huynh em {student_name}: Trong tháng 9, em đã có nhiều cố gắng trong học tập. Giáo viên rất mong gia đình cùng phối hợp nhắc nhở con chuẩn bị bài chu đáo và rèn tính kiên nhẫn để con tiến bộ vượt bậc trong tháng 10."
    
    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "intervention": intervention,
        "weekly_goal": weekly_goal,
        "parent_message": parent_msg
    }
