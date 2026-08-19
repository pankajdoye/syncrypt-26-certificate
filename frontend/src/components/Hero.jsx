import React from 'react';
import { Lock, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative text-center py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Subtle cybersecurity accent badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-cyber-blue text-xs font-semibold uppercase tracking-widest mb-4">
        <Cpu className="w-3.5 h-3.5" />
        CRYPTX SECURITY RIT PRESENTS
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight">
        SYNCRYPT’26
      </h1>

      {/* Subtitle */}
      <h2 className="text-xl sm:text-2xl font-bold text-cyber-blue mt-2">
        Certificate Download Portal
      </h2>

      {/* Description */}
      <p className="text-slate-600 max-w-xl mx-auto mt-3 text-base sm:text-lg leading-relaxed">
        Enter your registered <span className="font-semibold text-slate-800">PRN</span> below to verify your participation and download your official event certificate.
      </p>
    </div>
  );
}
