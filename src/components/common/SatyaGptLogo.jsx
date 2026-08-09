import React from 'react';

export default function SatyaGptLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="logoShieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="logoCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
      </defs>

      {/* Outer Cyber Shield Contour */}
      <path
        d="M 256,48 L 416,112 V 240 C 416,340 348,424 256,464 C 164,424 96,340 96,240 V 112 Z"
        fill="#131B2E"
        stroke="url(#logoShieldBorder)"
        strokeWidth="20"
        strokeLinejoin="round"
      />

      {/* Inner Tech Lattice Circuits */}
      <path d="M 256,100 V 412" stroke="#1E2D4A" strokeWidth="8" strokeDasharray="12 10" />
      <path d="M 140,240 H 372" stroke="#1E2D4A" strokeWidth="8" strokeDasharray="12 10" />

      {/* Cyber Circuit Nodes */}
      <circle cx="256" cy="140" r="14" fill="#00E5FF" />
      <circle cx="256" cy="360" r="14" fill="#10B981" />
      <circle cx="160" cy="240" r="12" fill="#F59E0B" />
      <circle cx="352" cy="240" r="12" fill="#00E5FF" />

      {/* Central SATYA-GPT Core Eye Shield */}
      <path
        d="M 256,170 C 310,170 348,240 348,240 C 348,240 310,310 256,310 C 202,310 164,240 164,240 C 164,240 202,170 256,170 Z"
        fill="none"
        stroke="url(#logoCoreGlow)"
        strokeWidth="16"
        strokeLinejoin="round"
      />

      {/* Central Biometric Core Pupil */}
      <circle cx="256" cy="240" r="38" fill="#00E5FF" />
      <circle cx="256" cy="240" r="18" fill="#0B0F19" />
    </svg>
  );
}
