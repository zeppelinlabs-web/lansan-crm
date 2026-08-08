'use client';

import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  saveLabel = 'Save',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-heading)',
          }}
        >
          {title}
        </div>
        <div style={{ padding: '20px', flex: 1 }}>{children}</div>
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            background: '#fafafa',
            borderBottomLeftRadius: '14px',
            borderBottomRightRadius: '14px',
          }}
        >
          <Button variant="sm" onClick={onClose}>
            Cancel
          </Button>
          {onSave && (
            <Button variant="primary" className="btn-sm" onClick={onSave}>
              {saveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
