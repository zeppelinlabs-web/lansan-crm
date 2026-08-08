'use client';

import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  saveLabel = 'Save',
  isLoading = false,
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              padding: '4px',
            }}
          >
            <i className="ti ti-x" style={{ fontSize: '18px' }}></i>
          </button>
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
          <Button variant="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          {onSave && (
            <Button variant="primary" className="btn-sm" onClick={onSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="ti ti-loader-2 spin" style={{ marginRight: '6px' }}></i>
                  Saving...
                </>
              ) : (
                saveLabel
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
