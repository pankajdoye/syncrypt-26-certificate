import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-slate-400 py-8 px-4 sm:px-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        {/* Left: Club & Institution */}
        <div className="flex items-center gap-3">
          <img 
            src="/cryptx-logo.png" 
            alt="CryptX Security RIT Logo" 
            className="w-8 h-8 object-contain"
          />
          <div>
            <div className="text-white font-bold text-sm tracking-wide">CRYPTX SECURITY RIT</div>
            <div className="text-xs text-slate-400">Rajarambapu Institute of Technology, Rajaramnagar</div>
          </div>
        </div>

        {/* Right: Event Info */}
        <div className="text-xs font-semibold text-cyber-cyan tracking-wider">
          SYNCRYPT’26 • 19 August 2026
        </div>

      </div>
    </footer>
  );
}
