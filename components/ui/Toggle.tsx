import React from 'react';

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  title?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ on, onToggle, title }) => {
  return (
    <button
      className={`toggle ${on ? 'on' : ''}`}
      onClick={onToggle}
      title={title || (on ? 'Disable' : 'Enable')}
      type="button"
    />
  );
};
