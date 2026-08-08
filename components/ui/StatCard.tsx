import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
};
