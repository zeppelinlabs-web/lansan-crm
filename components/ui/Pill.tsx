import React from 'react';
import { StatusType } from '@/lib/types';

interface PillProps {
  status: StatusType | string;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({ status, className = '' }) => {
  const map: Record<string, string> = {
    Active: 'pill-green',
    Paid: 'pill-green',
    Won: 'pill-green',
    Succeeded: 'pill-green',
    Manager: 'pill-green',
    
    Lead: 'pill-blue',
    Sent: 'pill-blue',
    Admin: 'pill-blue',
    Cold: 'score-cold',

    Pending: 'pill-amber',
    Medium: 'pill-amber',
    'In progress': 'pill-amber',
    Warm: 'score-warm',

    Overdue: 'pill-red',
    Failed: 'pill-red',
    High: 'pill-red',
    Hot: 'score-hot',

    Inactive: 'pill-gray',
    Draft: 'pill-gray',
    Low: 'pill-gray',
    Closed: 'pill-gray',
    Agent: 'pill-gray',
  };

  const pillClass = map[status] || 'pill-gray';

  return <span className={`pill ${pillClass} ${className}`}>{status}</span>;
};
