import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleImagePaths = [
  path.join(__dirname, '../certificate/certificate-template.png'),
  path.join(process.cwd(), 'backend/certificate/certificate-template.png'),
  path.join(__dirname, '../../frontend/public/certificate-template.png'),
  path.join(process.cwd(), 'frontend/public/certificate-template.png'),
  path.join(__dirname, '../../frontend/src/assets/certificate-template.png'),
  path.join(process.cwd(), 'frontend/src/assets/certificate-template.png'),
  path.join(process.cwd(), 'SYNCRYPT26_Certificate (1).pdf (1).png'),
];

/**
 * Generates dynamic certificate PDF for participant using the SYNCRYPT'26 certificate template.
 */
export async function generateCertificatePDF(participantName) {
  const templatePath = possibleImagePaths.find(p => fs.existsSync(p)) || possibleImagePaths[0];

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Certificate template image not found at ${templatePath}`);
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // A4 Landscape dimensions: 842.88 x 595.92 points
  const pageWidth = 842.88;
  const pageHeight = 595.92;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Read and embed high-res certificate background PNG template
  const imageBytes = fs.readFileSync(templatePath);
  const embeddedImage = await pdfDoc.embedPng(imageBytes);

  // Draw background template image filling the A4 landscape page
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  // Embed Helvetica-Bold font
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Positioning calculations:
  // 'Mr./Ms.' text ends at ~260pt from left on A4 canvas.
  // A natural 1-2 space gap places the participant name starting at X = 268pt.
  const startX = 268;
  const baselineY = 240;
  const maxAvailableWidth = 370;

  // Dynamic font scaling for long names
  let fontSize = 22;
  let textWidth = font.widthOfTextAtSize(participantName, fontSize);

  if (textWidth > maxAvailableWidth) {
    fontSize = Math.floor(fontSize * (maxAvailableWidth / textWidth));
    if (fontSize < 12) fontSize = 12;
    textWidth = font.widthOfTextAtSize(participantName, fontSize);
  }

  // Gold Color #D4AF37 -> RGB (212/255, 175/255, 55/255)
  const goldColor = rgb(212 / 255, 175 / 255, 55 / 255);

  // Draw Golden Participant Name
  page.drawText(participantName, {
    x: startX,
    y: baselineY,
    size: fontSize,
    font: font,
    color: goldColor,
  });

  // Save and return PDF Buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
