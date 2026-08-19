import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust path resolution for local dev & Vercel serverless function execution
const possibleJsonPaths = [
  path.join(process.cwd(), 'backend/data/participants.json'),
  path.join(process.cwd(), 'data/participants.json'),
  path.join(__dirname, '../data/participants.json'),
  path.join(__dirname, '../../backend/data/participants.json'),
  path.join(__dirname, '../../../backend/data/participants.json')
];

const possibleExcelPaths = [
  path.join(process.cwd(), 'backend/data/participants.xlsx'),
  path.join(process.cwd(), 'data/participants.xlsx'),
  path.join(__dirname, '../data/participants.xlsx'),
  path.join(__dirname, '../../backend/data/participants.xlsx'),
  path.join(__dirname, '../../../backend/data/participants.xlsx'),
  path.join(process.cwd(), 'SYNCRYPT ’26 — Registration Form  (Responses) (2).xlsx'),
  path.join(__dirname, '../SYNCRYPT ’26 — Registration Form  (Responses) (2).xlsx')
];

// Map to store normalized PRN / email -> Participant details
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
 * Loads participant data into memory
 */
export function loadParticipantData() {
  try {
    participantMap.clear();
    let rows = [];
    let loadedFrom = '';

    // 1. Try reading participants.json from filesystem
    const jsonPath = possibleJsonPaths.find(p => fs.existsSync(p));
    if (jsonPath) {
      try {
        const jsonRaw = fs.readFileSync(jsonPath, 'utf8');
        rows = JSON.parse(jsonRaw);
        loadedFrom = jsonPath;
      } catch (err) {
        console.warn('[ExcelService] Failed to parse JSON from path:', jsonPath, err);
      }
    }

    // 2. If JSON not loaded, try reading participants.xlsx
    if (rows.length === 0) {
      const excelPath = possibleExcelPaths.find(p => fs.existsSync(p));
      if (excelPath) {
        try {
          const workbook = xlsx.readFile(excelPath);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          rows = xlsx.utils.sheet_to_json(sheet);
          loadedFrom = excelPath;
        } catch (err) {
          console.warn('[ExcelService] Failed to read Excel from path:', excelPath, err);
        }
      }
    }

    rows.forEach(row => {
      const prnKey = Object.keys(row).find(k => /prn|roll/i.test(k));
      const nameKey = Object.keys(row).find(k => /full\s*name|name/i.test(k));

      if (prnKey && row[prnKey]) {
        const normalizedPRN = normalizePRN(row[prnKey]);
        const name = nameKey && row[nameKey] ? normalizeName(row[nameKey]) : '';
        
        if (normalizedPRN && name) {
          const participantObj = {
            prn: normalizedPRN,
            name: name,
            email: row['Email Address'] || row['Official College Email ID'] || '',
            department: row['Department '] || row['Department'] || ''
          };

          participantMap.set(normalizedPRN, participantObj);
          participantMap.set(normalizedPRN.toLowerCase(), participantObj);

          // Support lookup without leading zeros
          const prnWithoutLeadingZeros = normalizedPRN.replace(/^0+/, '');
          if (prnWithoutLeadingZeros && prnWithoutLeadingZeros !== normalizedPRN) {
            participantMap.set(prnWithoutLeadingZeros, participantObj);
          }

          // Support email lookups or PRN with email domain (e.g. 2403120@ritindia.edu)
          if (participantObj.email) {
            const cleanEmail = String(participantObj.email).trim().toLowerCase();
            if (cleanEmail) {
              participantMap.set(cleanEmail, participantObj);
              const prefix = cleanEmail.split('@')[0];
              if (prefix && !participantMap.has(prefix)) {
                participantMap.set(prefix, participantObj);
              }
            }
          }
        }
      }
    });

    console.log(`[ExcelService] Loaded ${participantMap.size} lookup keys from ${rows.length} participants (${loadedFrom || 'none'}).`);
  } catch (error) {
    console.error('[ExcelService] Error loading participant data:', error);
  }
}

// Initial load
loadParticipantData();

/**
 * Verified lookup function by PRN or Email
 */
export function getParticipantByPRN(rawPRN) {
  if (participantMap.size === 0) {
    loadParticipantData();
  }
  const cleanPRN = normalizePRN(rawPRN);
  if (!cleanPRN) return null;

  // Direct lookup
  let found = participantMap.get(cleanPRN) || participantMap.get(cleanPRN.toLowerCase());
  if (found) return found;

  // Try without leading zeros
  const withoutZeros = cleanPRN.replace(/^0+/, '');
  if (withoutZeros) {
    found = participantMap.get(withoutZeros);
    if (found) return found;
  }

  // Fallback: If user entered email or PRN@domain, check prefix
  if (cleanPRN.includes('@')) {
    const prefix = cleanPRN.split('@')[0].trim().toLowerCase();
    found = participantMap.get(prefix);
    if (found) return found;
  }

  return null;
}
