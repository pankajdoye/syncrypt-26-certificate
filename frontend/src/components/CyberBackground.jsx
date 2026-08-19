import React from 'react';

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {/* Subtle Digital Grid */}
      <div className="absolute inset-0 cyber-grid" />
      
      {/* Subtle Circuit Accents */}
      <svg className="absolute top-10 left-10 w-96 h-96 text-blue-500/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M10,10 L30,10 L40,30 L70,30 L80,50 L90,50" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <circle cx="40" cy="30" r="1.5" fill="currentColor" />
        <circle cx="80" cy="50" r="1.5" fill="currentColor" />
      </svg>

      <svg className="absolute bottom-10 right-10 w-96 h-96 text-cyan-500/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M90,90 L70,90 L60,70 L30,70 L20,50 L10,50" />
        <circle cx="90" cy="90" r="1.5" fill="currentColor" />
        <circle cx="60" cy="70" r="1.5" fill="currentColor" />
        <circle cx="20" cy="50" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
