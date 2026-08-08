'use client';

import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let toastClass = 'toast-info';
        let iconClass = 'ti ti-info-circle';

        if (toast.type === 'success') {
          toastClass = 'toast-success';
          iconClass = 'ti ti-circle-check';
        } else if (toast.type === 'error') {
          toastClass = 'toast-error';
          iconClass = 'ti ti-alert-circle';
        }

        return (
          <div key={toast.id} className={`toast-item ${toastClass}`}>
            <i className={iconClass} style={{ fontSize: '18px', flexShrink: 0 }}></i>
            <span style={{ flex: 1 }}>{toast.text}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
                padding: '2px',
              }}
            >
              <i className="ti ti-x" style={{ fontSize: '14px' }}></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
