import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Download, Loader2, RefreshCw, ShieldAlert, Award } from 'lucide-react';

export default function VerificationCard({ onVerify, onDownload, loading, downloading, result, onReset }) {
  const [prnInput, setPrnInput] = useState('');
  const [clientError, setClientError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = prnInput.trim();
    if (!trimmed) {
      setClientError('Please enter your PRN.');
      return;
    }
    setClientError('');
    onVerify(trimmed);
  };

  const handleInputChange = (e) => {
    setPrnInput(e.target.value);
    if (clientError) setClientError('');
  };

  const handleTryAgain = () => {
    setPrnInput('');
    setClientError('');
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Top Card Accent Header */}
      <div className="bg-navy-900 px-6 py-4 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Award className="w-4 h-4 text-gold-500" />
          <span>SYNCRYPT’26 Verification</span>
        </div>
        <span className="text-xs text-cyber-cyan font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50">
          SECURE LOG
        </span>
      </div>

      <div className="p-6 sm:p-8">

        {/* 1. INITIAL INPUT FORM STATE */}
        {!result && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-navy-900">
                Download Your Certificate
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Enter your registered PRN
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prn-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                PRN
              </label>
              <div className="relative">
                <input
                  id="prn-input"
                  type="text"
                  value={prnInput}
                  onChange={handleInputChange}
                  placeholder="Enter your PRN"
                  disabled={loading}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-base focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all disabled:opacity-60"
                  autoComplete="off"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
              </div>
              {clientError && (
                <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {clientError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-cyber-blue hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying PRN...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>VERIFY PRN</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. SUCCESS STATE */}
        {result && result.success && (
          <div className="text-center py-2 space-y-6 animate-fadeIn">
            {/* Green Check Icon */}
            <div className="w-16 h-16 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center mx-auto text-success">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-emerald-700 tracking-tight flex items-center justify-center gap-2">
                <span>✓ Certificate Verified</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-4">
                Participant Name
              </p>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-200/80 inline-block max-w-full truncate">
                {result.name}
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600">
              Your SYNCRYPT’26 participation certificate is ready.
            </p>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => onDownload(result.prn)}
                disabled={downloading}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-75"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Certificate PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>DOWNLOAD CERTIFICATE PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={handleTryAgain}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Verify Another PRN</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. INVALID / ERROR STATE */}
        {result && !result.success && (
          <div className="text-center py-2 space-y-5 animate-fadeIn">
            {/* Red Error Icon */}
            <div className="w-16 h-16 bg-red-50 rounded-full border border-red-200 flex items-center justify-center mx-auto text-error">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-error flex items-center justify-center gap-1.5">
                <span>✕ Certificate Not Found</span>
              </h3>
              <p className="text-sm text-slate-600 mt-3 px-2 leading-relaxed">
                The entered PRN is not registered for SYNCRYPT’26. Please check your PRN and try again.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleTryAgain}
                className="w-full py-3.5 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
