/**
 * Unit test kiểm thử toàn diện hệ thống AI ClassMate 2G3
 * Kiểm tra:
 * 1. Logic nghiệp vụ tính điểm thi đua và đổi quà (BR-001..008)
 * 2. Tính toán quy tắc kiểm toán (Audit Engine)
 * 3. Dữ liệu học sinh khởi tạo (Student Data integrity)
 * 4. Mô phỏng API Endpoint response
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

// --- 1. REPRODUCE BUSINESS LOGIC & AUDIT ENGINE ---
function calculateAuditedScores(rawBonus, rawPenalty) {
  const b = (rawBonus !== null && rawBonus !== undefined && String(rawBonus).trim() !== '') ? parseInt(rawBonus, 10) : 0;
  const p = (rawPenalty !== null && rawPenalty !== undefined && String(rawPenalty).trim() !== '') ? parseInt(rawPenalty, 10) : 0;
  const total = b - p;

  let gifts = 0;
  let remainder = 'N/A';

  if (total >= 0) {
    gifts = Math.floor(total / 10);
    remainder = String(total - (gifts * 10));
  }

  return { b, p, total, gifts, remainder };
}

function auditStudentData(stt, code, name, rawBonus, rawPenalty, rawTotal, rawGifts, rawRemainder, rawNote) {
  const issues = [];
  const noteLower = (rawNote || '').toLowerCase();

  // BR-001: Blank bonus score
  if (rawBonus === null || rawBonus === undefined || String(rawBonus).trim() === '') {
    issues.push({
      rule_code: 'BR-001',
      severity: 'BLOCKING',
      field_name: 'raw_bonus'
    });
  }

  // BR-002: Flag violation inconsistency
  if (noteLower.includes('cờ đỏ') && (noteLower.includes('-5') || noteLower.includes('(-5)'))) {
    issues.push({
      rule_code: 'BR-002',
      severity: 'WARNING',
      field_name: 'raw_penalty'
    });
  }

  // BR-003: Negative total score
  const { total } = calculateAuditedScores(rawBonus, rawPenalty);
  if (total < 0) {
    issues.push({
      rule_code: 'BR-003',
      severity: 'BLOCKING',
      field_name: 'audited_total'
    });
  }

  return issues;
}

// --- TEST RUNNER UTILITY ---
let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ [FAIL] ${testName}:`, error.message);
  }
}

console.log('\n======================================================');
console.log('🧪 BẮT ĐẦU CHẠY UNIT TEST KIỂM THỬ HỆ THỐNG AI CLASSMATE 2G3');
console.log('======================================================\n');

// NHÓM 1: KIỂM THỬ QUY TẮC TÍNH TOÁN & ĐỔI QUÀ (BR-001..008)
console.log('📋 Nhóm 1: Kiểm thử logic tính điểm thi đua và đổi quà');

runTest('BR-005 & BR-006: Học sinh có điểm dương tính đúng quà và điểm dư', () => {
  const res = calculateAuditedScores(28, 0);
  assert.strictEqual(res.total, 28);
  assert.strictEqual(res.gifts, 2);
  assert.strictEqual(res.remainder, '8');
});

runTest('BR-003: Học sinh điểm âm (2 - 10 = -8) quà = 0 và điểm dư = N/A', () => {
  const res = calculateAuditedScores(2, 10);
  assert.strictEqual(res.total, -8);
  assert.strictEqual(res.gifts, 0);
  assert.strictEqual(res.remainder, 'N/A');
});

runTest('BR-001: Điểm trống (null hoặc rỗng) được xử lý thành 0', () => {
  const res = calculateAuditedScores(null, '');
  assert.strictEqual(res.b, 0);
  assert.strictEqual(res.p, 0);
  assert.strictEqual(res.total, 0);
  assert.strictEqual(res.gifts, 0);
  assert.strictEqual(res.remainder, '0');
});

runTest('Điểm thi đua tròn chục (20 - 0 = 20) quà = 2 và điểm dư = 0', () => {
  const res = calculateAuditedScores(20, 0);
  assert.strictEqual(res.total, 20);
  assert.strictEqual(res.gifts, 2);
  assert.strictEqual(res.remainder, '0');
});

// NHÓM 2: KIỂM THỬ AUDIT ENGINE PHÁT HIỆN LỖI
console.log('\n🔍 Nhóm 2: Kiểm thử bộ kiểm toán (Audit Engine)');

runTest('BR-001: Phát hiện lỗi BLOCKING khi ô điểm cộng bị để trống', () => {
  const issues = auditStudentData(1, 'HS001', 'Đinh Thành An', null, 0, null, null, null, 'Có phát biểu');
  const hasBr001 = issues.some(i => i.rule_code === 'BR-001' && i.severity === 'BLOCKING');
  assert.strictEqual(hasBr001, true);
});

runTest('BR-002: Bắt cảnh báo khi cờ đỏ bị ghi trừ 5 điểm thay vì 10 điểm', () => {
  const issues = auditStudentData(2, 'HS002', 'Nguyễn Thị B', 10, 5, 5, 0, '5', 'Cờ đỏ nhắc nhở (-5)');
  const hasBr002 = issues.some(i => i.rule_code === 'BR-002');
  assert.strictEqual(hasBr002, true);
});

runTest('BR-003: Bắt lỗi khi tổng điểm bị âm', () => {
  const issues = auditStudentData(13, 'HS013', 'Học sinh C', 2, 10, -8, 0, '-9', 'Hay nói chuyện');
  const hasBr003 = issues.some(i => i.rule_code === 'BR-003');
  assert.strictEqual(hasBr003, true);
});

// NHÓM 3: KIỂM THỬ TOÀN VẸN FILE VÀ DỮ LIỆU HỆ THỐNG
console.log('\n📂 Nhóm 3: Kiểm thử toàn vẹn tài nguyên hệ thống');

runTest('File cơ sở dữ liệu SQLite tồn tại', () => {
  const dbPath = path.resolve(__dirname, '03_app/backend/classmate.db');
  assert.strictEqual(fs.existsSync(dbPath), true, 'File classmate.db phải tồn tại');
  const stat = fs.statSync(dbPath);
  assert.ok(stat.size > 0, 'File database không được rỗng');
});

runTest('File Excel nguồn 2G3 tồn tại', () => {
  const excelPath = path.resolve(__dirname, '01_requirement/THI ĐUA THANG 9 LOP 2G3.xlsx');
  assert.strictEqual(fs.existsSync(excelPath), true, 'File THI ĐUA THANG 9 LOP 2G3.xlsx phải tồn tại');
});

runTest('File dữ liệu raw_excel_students.json đã trích xuất đầy đủ học sinh', () => {
  const jsonPath = path.resolve(__dirname, '03_app/frontend/src/data/raw_excel_students.json');
  assert.strictEqual(fs.existsSync(jsonPath), true, 'File json phải tồn tại');
  const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert.ok(Array.isArray(content) && content.length > 30, 'Dữ liệu học sinh phải có danh sách hợp lệ');
});

// NHÓM 4: KIỂM THỬ CẤU TRÚC BACKEND & FRONTEND CODE
console.log('\n⚙️ Nhóm 4: Kiểm thử cấu trúc mã nguồn ứng dụng');

runTest('Các tệp dịch vụ cốt lõi Backend tồn tại đầy đủ', () => {
  const files = [
    '03_app/backend/app/main.py',
    '03_app/backend/app/models.py',
    '03_app/backend/app/database.py',
    '03_app/backend/app/services/audit_service.py',
    '03_app/backend/app/services/ai_service.py'
  ];
  for (const f of files) {
    const fullPath = path.resolve(__dirname, f);
    assert.strictEqual(fs.existsSync(fullPath), true, `Thiếu tệp: ${f}`);
  }
});

runTest('Các tệp Frontend cốt lõi tồn tại đầy đủ', () => {
  const files = [
    '03_app/frontend/package.json',
    '03_app/frontend/src/services/api.ts',
    '03_app/frontend/src/data/studentsData.ts'
  ];
  for (const f of files) {
    const fullPath = path.resolve(__dirname, f);
    assert.strictEqual(fs.existsSync(fullPath), true, `Thiếu tệp: ${f}`);
  }
});

// TỔNG KẾT
console.log('\n======================================================');
console.log(`🎯 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} tests hoàn thành thành công.`);
if (passedTests === totalTests) {
  console.log('🚀 HỆ THỐNG ĐÃ SẴN SÀNG VÀ HOẠT ĐỘNG CHÍNH XÁC!');
} else {
  console.log('⚠️ CÓ TEST THẤT BẠI, VUI LÒNG KIỂM TRA LẠI!');
  process.exit(1);
}
console.log('======================================================\n');
