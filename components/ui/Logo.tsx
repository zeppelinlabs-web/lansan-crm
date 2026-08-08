'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
  };

  const fontSizes = {
    sm: '15px',
    md: '18px',
    lg: '24px',
  };

  const currentSize = iconSizes[size];

  return (
    <div
      className={`lansan-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Lansan Brand Mark SVG Icon */}
      <div
        style={{
          width: `${currentSize}px`,
          height: `${currentSize}px`,
          borderRadius: size === 'sm' ? '6px' : '9px',
          background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(29, 158, 117, 0.28)',
          flexShrink: 0,
        }}
      >
        <svg
          width={currentSize * 0.65}
          height={currentSize * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19l4-14 4 14" />
          <path d="M12 19l4-10 4 10" />
          <line x1="6" y1="13" x2="18" y2="13" />
        </svg>
      </div>

      {showText && (
        <span
          style={{
            fontSize: fontSizes[size],
            color: lightMode ? '#ffffff' : '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ fontWeight: 800 }}>Lansan</span>
          <span
            style={{
              fontWeight: 500,
              background: 'linear-gradient(135deg, #1D9E75 0%, #0D5C46 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CRM
          </span>
        </span>
      )}
    </div>
  );
};
