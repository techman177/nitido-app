import React from 'react';

export default function Logo({ className = "h-8 md:h-10", gold = true }: { className?: string, gold?: boolean }) {
  return (
    <svg 
      viewBox="0 0 320 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B49248" />
          <stop offset="50%" stopColor="#E5CC89" />
          <stop offset="100%" stopColor="#B49248" />
        </linearGradient>
      </defs>

      {/* Emblem "N" */}
      <g>
        <path 
          d="M20 60V25C20 22.2386 22.2386 20 25 20H35C37.7614 20 40 22.2386 40 25V55C40 57.7614 42.2386 60 45 60H55C57.7614 60 60 57.7614 60 55V20" 
          stroke={gold ? "url(#goldGradient)" : "currentColor"} 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* The sparkle star */}
        <path 
          d="M68 15C68 15 69 22 75 22C69 22 68 29 68 29C68 29 67 22 61 22C67 22 68 15 68 15Z" 
          fill={gold ? "url(#goldGradient)" : "currentColor"}
        />
      </g>

      {/* Typography "NÍTIDO" */}
      <text 
        x="95" 
        y="56" 
        fill={gold ? "url(#goldGradient)" : "currentColor"} 
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          fontWeight: 900, 
          fontSize: '48px', 
          letterSpacing: '-0.05em' 
        }}
      >
        NÍTIDO
      </text>
    </svg>
  );
}
