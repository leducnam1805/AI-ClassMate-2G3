const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.resolve(__dirname, '../../01_requirement/THI ĐUA THANG 9 LOP 2G3.xlsx');
console.log('Reading from:', excelPath);

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
console.log('Sheet name:', sheetName);

const worksheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

console.log('Total rows:', rawData.length);
console.log('Header sample:', JSON.stringify(rawData.slice(0, 5), null, 2));

const outJsonPath = path.resolve(__dirname, '../src/data/raw_excel_students.json');
fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.writeFileSync(outJsonPath, JSON.stringify(rawData, null, 2), 'utf-8');
console.log('Saved raw data to:', outJsonPath);
