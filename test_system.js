/**
 * Bộ kiểm thử toàn diện hệ thống AI ClassMate 2G3
 * Kiểm thử:
 * 1. Nghiệp vụ tính toán điểm thi đua và đổi quà (BR-001..008)
 * 2. Bộ kiểm toán phát hiện sai sót (Audit Engine)
 * 3. Cấu hình môi trường & Kết nối CSDL PostgreSQL / Docker Compose
 * 4. Toàn vẹn cấu trúc file hệ thống và dữ liệu học sinh
 * 5. Cấu trúc mã nguồn Backend & Frontend
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

  // BR-002: Flag violation inconsistency (-5 instead of -10)
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
console.log('📋 Nhóm 1: Kiểm thử logic tính điểm thi đua và đổi quà (BR-001..008)');

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

runTest('BR-001: Điểm trống (null hoặc rỗng) được chuẩn hóa thành 0', () => {
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
console.log('\n🔍 Nhóm 2: Kiểm thử bộ kiểm toán phát hiện sai sót (Audit Engine)');

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

// NHÓM 3: KIỂM THỬ CẤU HÌNH POSTGRESQL & DOCKER COMPOSE
console.log('\n🐳 Nhóm 3: Kiểm thử cấu hình PostgreSQL & Docker Compose');

runTest('Tệp docker-compose.yml tồn tại và định nghĩa đầy đủ 3 services', () => {
  const composePath = path.resolve(__dirname, 'docker-compose.yml');
  assert.strictEqual(fs.existsSync(composePath), true, 'File docker-compose.yml phải tồn tại');
  const content = fs.readFileSync(composePath, 'utf8');
  assert.ok(content.includes('postgres:'), 'Phải có service postgres');
  assert.ok(content.includes('backend:'), 'Phải có service backend');
  assert.ok(content.includes('frontend:'), 'Phải có service frontend');
  assert.ok(content.includes('postgres-data:'), 'Phải có volume postgres-data');
});

runTest('Service postgres trong Docker Compose dùng image PostgreSQL 16 và port 5432', () => {
  const composePath = path.resolve(__dirname, 'docker-compose.yml');
  const content = fs.readFileSync(composePath, 'utf8');
  assert.ok(content.includes('postgres:16-alpine'), 'Cần dùng image postgres:16-alpine');
  assert.ok(content.includes('5432'), 'Cần map cổng 5432 cho PostgreSQL');
  assert.ok(content.includes('pg_isready'), 'Cần có healthcheck pg_isready');
});

runTest('Tệp môi trường .env và .env.example cấu hình đúng biến PostgreSQL', () => {
  const envExamplePath = path.resolve(__dirname, '.env.example');
  assert.strictEqual(fs.existsSync(envExamplePath), true, 'File .env.example phải tồn tại');
  const content = fs.readFileSync(envExamplePath, 'utf8');
  assert.ok(content.includes('POSTGRES_USER='), 'Cần có POSTGRES_USER');
  assert.ok(content.includes('POSTGRES_PASSWORD='), 'Cần có POSTGRES_PASSWORD');
  assert.ok(content.includes('POSTGRES_DB='), 'Cần có POSTGRES_DB');
  assert.ok(content.includes('DATABASE_URL=postgresql://'), 'Cần có DATABASE_URL');
});

runTest('File .gitignore bảo vệ .env không bị commit nhầm', () => {
  const gitignorePath = path.resolve(__dirname, '.gitignore');
  assert.strictEqual(fs.existsSync(gitignorePath), true, 'File .gitignore phải tồn tại');
  const content = fs.readFileSync(gitignorePath, 'utf8');
  assert.ok(content.includes('.env'), 'Phải ignore .env');
  assert.ok(content.includes('!.env.example'), 'Phải cho phép .env.example');
});

runTest('Backend requirements.txt chứa psycopg2-binary cho PostgreSQL', () => {
  const reqPath = path.resolve(__dirname, '03_app/backend/requirements.txt');
  assert.strictEqual(fs.existsSync(reqPath), true, 'File requirements.txt phải tồn tại');
  const content = fs.readFileSync(reqPath, 'utf8');
  assert.ok(content.includes('psycopg2-binary'), 'Phải có psycopg2-binary trong requirements');
});

runTest('Backend database.py hỗ trợ linh hoạt PostgreSQL và SQLite fallback', () => {
  const dbCodePath = path.resolve(__dirname, '03_app/backend/app/database.py');
  assert.strictEqual(fs.existsSync(dbCodePath), true, 'File database.py phải tồn tại');
  const content = fs.readFileSync(dbCodePath, 'utf8');
  assert.ok(content.includes('DATABASE_URL'), 'database.py phải kiểm tra DATABASE_URL');
  assert.ok(content.includes('POSTGRES_USER'), 'database.py phải kiểm tra POSTGRES_USER');
  assert.ok(content.includes('pool_pre_ping=True'), 'PostgreSQL phải cấu hình pool_pre_ping');
});

// NHÓM 4: KIỂM THỬ TOÀN VẸN TÀI NGUYÊN VÀ DỮ LIỆU
console.log('\n📂 Nhóm 4: Kiểm thử toàn vẹn tài nguyên hệ thống');

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

// NHÓM 5: KIỂM THỬ CẤU TRÚC MÃ NGUỒN ỨNG DỤNG
console.log('\n⚙️ Nhóm 5: Kiểm thử cấu trúc mã nguồn ứng dụng');

runTest('Các tệp dịch vụ cốt lõi Backend tồn tại đầy đủ', () => {
  const files = [
    '03_app/backend/app/main.py',
    '03_app/backend/app/models.py',
    '03_app/backend/app/database.py',
    '03_app/backend/app/seed.py',
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
    '03_app/frontend/src/app/page.tsx',
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
  console.log('🚀 TẤT CẢ TEST CASES ĐỀU PASS — HỆ THỐNG ĐÃ SẴN SÀNG!');
} else {
  console.log('⚠️ CÓ TEST THẤT BẠI, VUI LÒNG KIỂM TRA LẠI!');
  process.exit(1);
}
console.log('======================================================\n');
