import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-navy-900 border-b border-navy-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: CRYPTX Logo */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-navy-800 p-1 border border-navy-700 flex items-center justify-center overflow-hidden">
            <img 
              src="/cryptx-logo.png" 
              alt="CRYPTX SECURITY RIT Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              CRYPTX <span className="text-cyber-cyan text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">SECURITY RIT</span>
            </h2>
            <p className="text-xs text-slate-400">Rajarambapu Institute of Technology</p>
          </div>
        </div>

        {/* Right: SYNCRYPT'26 Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-extrabold text-cyber-cyan tracking-wider">SYNCRYPT’26</div>
            <div className="text-xs text-slate-400 font-medium">Certificate Portal</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>
    </header>
  );
}
