import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import VerificationCard from './components/VerificationCard.jsx';
import CyberBackground from './components/CyberBackground.jsx';
import Footer from './components/Footer.jsx';

// Base API URL: Uses VITE_API_URL if configured (e.g. Render backend URL), or relative path /api
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Generate certificate PDF on client side using current dashboard template (/certificate-template.png)
 */
async function generateClientCertificatePDF(participantName) {
  const imgResponse = await fetch(`/certificate-template.png?v=${Date.now()}`, { cache: 'no-store' });
  if (!imgResponse.ok) {
    throw new Error('Failed to load certificate template image');
  }
  const imageBytes = await imgResponse.arrayBuffer();

  const pdfDoc = await PDFDocument.create();
  const pageWidth = 842.88;
  const pageHeight = 595.92;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const embeddedImage = await pdfDoc.embedPng(imageBytes);

  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const startX = 268;
  const baselineY = 240;
  const maxAvailableWidth = 370;

  let fontSize = 22;
  let textWidth = font.widthOfTextAtSize(participantName, fontSize);

  if (textWidth > maxAvailableWidth) {
    fontSize = Math.floor(fontSize * (maxAvailableWidth / textWidth));
    if (fontSize < 12) fontSize = 12;
  }

  const goldColor = rgb(212 / 255, 175 / 255, 55 / 255);

  page.drawText(participantName, {
    x: startX,
    y: baselineY,
    size: fontSize,
    font: font,
    color: goldColor,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);

  /**
   * Handle PRN verification call
   */
  const handleVerifyPRN = async (prn) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/certificate/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prn }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          name: data.name,
          prn: data.prn,
        });
      } else {
        setResult({
          success: false,
          message: data.message || 'The entered PRN is not registered for SYNCRYPT’26.',
        });
      }
    } catch (error) {
      console.error('API Verification error:', error);
      setResult({
        success: false,
        message: 'Unable to connect to verification server. Please check your network and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Certificate PDF Download
   */
  const handleDownloadPDF = async (prn, participantName) => {
    if (!prn) return;
    setDownloading(true);

    const nameToUse = participantName || result?.name || 'Participant';
    let pdfBlob = null;
    let filename = `SYNCRYPT_26_Certificate_${nameToUse.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    try {
      const response = await fetch(`${API_BASE}/api/certificate/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prn }),
      });

      if (response.ok) {
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }
        pdfBlob = await response.blob();
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (apiError) {
      console.warn('Backend download call failed or returned error, using client PDF generator:', apiError);
      try {
        pdfBlob = await generateClientCertificatePDF(nameToUse);
      } catch (clientError) {
        console.error('Client PDF generation error:', clientError);
        alert('Failed to generate certificate PDF. Please try again.');
        setDownloading(false);
        return;
      }
    }

    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
    setDownloading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50 text-slate-900 selection:bg-cyber-blue selection:text-white">
      {/* Background Cyber Grid */}
      <CyberBackground />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center relative z-10">
        <Hero />
        
        <div className="w-full mt-2 sm:mt-6">
          <VerificationCard
            onVerify={handleVerifyPRN}
            onDownload={handleDownloadPDF}
            loading={loading}
            downloading={downloading}
            result={result}
            onReset={handleReset}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
