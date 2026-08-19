import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, '../data/participants.xlsx');

// Map to store normalized PRN -> Participant details
let participantMap = new Map();

/**
 * Normalizes PRN inputs by stripping spaces and removing trailing '.0' if parsed as floats
 */
export function normalizePRN(rawPRN) {
  if (rawPRN === undefined || rawPRN === null) return '';
  let str = String(rawPRN).trim();
  // Handle float strings like '2560005.0'
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
    const workbook = xlsx.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    rows.forEach(row => {
      // Find key for PRN and Name flexibly
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
  const cleanPRN = normalizePRN(rawPRN);
  if (!cleanPRN) return null;
  return participantMap.get(cleanPRN) || null;
}
