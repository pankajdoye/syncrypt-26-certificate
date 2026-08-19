import express from 'express';
import { getParticipantByPRN } from '../services/excelService.js';
import { generateCertificatePDF } from '../services/certificateService.js';

const router = express.Router();

/**
 * Clean filename helper
 */
function sanitizeFilename(name) {
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
}

/**
 * POST /api/certificate/verify
 * Input: { prn: "1234567890" }
 */
router.post('/verify', async (req, res) => {
  try {
    const { prn } = req.body;
    
    if (!prn || !String(prn).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your PRN.'
      });
    }

    const participant = getParticipantByPRN(prn);

    if (!participant) {
      return res.status(404).json({ // 404 Not Found
        success: false,
        message: 'The entered PRN is not registered for SYNCRYPT’26. Please check your PRN and try again.'
      });
    }

    return res.status(200).json({
      success: true,
      name: participant.name,
      prn: participant.prn,
      message: 'Certificate verified successfully'
    });

  } catch (error) {
    console.error('[Verify API Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while verifying PRN.'
    });
  }
});

/**
 * POST /api/certificate/download
 * Input: { prn: "1234567890" }
 */
router.post('/download', async (req, res) => {
  try {
    const { prn } = req.body;

    if (!prn || !String(prn).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your PRN.'
      });
    }

    const participant = getParticipantByPRN(prn);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found.'
      });
    }

    const pdfBuffer = await generateCertificatePDF(participant.name);
    const safeName = sanitizeFilename(participant.name);
    const filename = `SYNCRYPT_26_Certificate_${safeName}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.send(pdfBuffer);

  } catch (error) {
    console.error('[Download API Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate certificate PDF.'
    });
  }
});

export default router;
