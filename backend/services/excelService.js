import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust path resolution for local dev & Vercel serverless function execution
const possiblePaths = [
  path.join(process.cwd(), 'backend/data/participants.xlsx'),
  path.join(__dirname, '../data/participants.xlsx'),
  path.join(__dirname, '../../backend/data/participants.xlsx')
];

let EXCEL_PATH = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];

// Map to store normalized PRN -> Participant details
let participantMap = new Map();

/**
 * Normalizes PRN inputs by stripping spaces and removing trailing '.0' if parsed as floats
 */
export function normalizePRN(rawPRN) {
  if (rawPRN === undefined || rawPRN === null) return '';
  let str = String(rawPRN).trim();
  if (str.endsWith('.0')) {
    str = str.slice(0, -2);
  }
  return str;
}

/**
 * Normalizes participant name
 */
export function normalizeName(rawName) {
  if (!rawName) return '';
  return String(rawName).trim().replace(/\s+/g, ' ');
}

/**
 * Loads Excel file into memory
 */
export function loadParticipantData() {
  try {
    participantMap.clear();
    
    // Re-check path in case of serverless cold start
    if (!fs.existsSync(EXCEL_PATH)) {
      const found = possiblePaths.find(p => fs.existsSync(p));
      if (found) EXCEL_PATH = found;
    }

    if (!fs.existsSync(EXCEL_PATH)) {
      console.error('[ExcelService] Excel file not found at:', EXCEL_PATH);
      return;
    }

    const workbook = xlsx.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    rows.forEach(row => {
      const prnKey = Object.keys(row).find(k => /prn|roll/i.test(k));
      const nameKey = Object.keys(row).find(k => /full\s*name|name/i.test(k));

      if (prnKey && row[prnKey]) {
        const normalizedPRN = normalizePRN(row[prnKey]);
        const name = nameKey && row[nameKey] ? normalizeName(row[nameKey]) : '';
        
        if (normalizedPRN && name) {
          participantMap.set(normalizedPRN, {
            prn: normalizedPRN,
            name: name,
            email: row['Email Address'] || row['Official College Email ID'] || '',
            department: row['Department '] || row['Department'] || ''
          });
        }
      }
    });

    console.log(`[ExcelService] Loaded ${participantMap.size} participants into memory.`);
  } catch (error) {
    console.error('[ExcelService] Error loading Excel file:', error);
  }
}

// Initial load
loadParticipantData();

/**
 * Verified lookup function by PRN
 */
export function getParticipantByPRN(rawPRN) {
  if (participantMap.size === 0) {
    loadParticipantData();
  }
  const cleanPRN = normalizePRN(rawPRN);
  if (!cleanPRN) return null;
  return participantMap.get(cleanPRN) || null;
}
