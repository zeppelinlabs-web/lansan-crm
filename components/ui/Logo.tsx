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
  className = '',
  lightMode = false,
}) => {
  const heights = {
    sm: '28px',
    md: '34px',
    lg: '44px',
  };

  const currentHeight = heights[size];

  return (
    <div
      className={`lansan-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Official Lansan CRM Brand Logo Image (Source of Truth) */}
      <img
        src="/images/lansan_crm_logo.png"
        alt="Lansan CRM Logo"
        style={{
          height: currentHeight,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: lightMode ? 'drop-shadow(0 2px 8px rgba(29, 158, 117, 0.4))' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
};
