import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import VerificationCard from './components/VerificationCard.jsx';
import CyberBackground from './components/CyberBackground.jsx';
import Footer from './components/Footer.jsx';

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
      const response = await fetch('/api/certificate/verify', {
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
  const handleDownloadPDF = async (prn) => {
    if (!prn) return;
    setDownloading(true);

    try {
      const response = await fetch('/api/certificate/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prn }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Extract filename from header if available, or generate fallback
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `SYNCRYPT_26_Certificate_${prn}.pdf`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF Download Error:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
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
