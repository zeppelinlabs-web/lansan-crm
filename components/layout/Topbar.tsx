'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCRM, ModalType } from '@/components/providers/CRMProvider';

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, openModal, currentUser, users, switchUser } = useCRM();

  interface PageConfig {
    title: string;
    btnLabel: string;
    modal: ModalType;
  }

  const getPageConfig = (): PageConfig => {
    switch (pathname) {
      case '/contacts':
        return { title: 'Contacts', btnLabel: 'Add contact', modal: 'addContact' };
      case '/pipeline':
        return { title: 'Pipeline', btnLabel: 'Add deal', modal: 'addDeal' };
      case '/tasks':
        return { title: 'Tasks', btnLabel: 'Add task', modal: 'addTask' };
      case '/leads':
        return { title: 'Lead generation', btnLabel: 'Add lead', modal: 'addLead' };
      case '/appointments':
        return { title: 'Appointments', btnLabel: 'New appointment', modal: 'addAppointment' };
      case '/automations':
        return { title: 'Automations', btnLabel: 'New rule', modal: 'addAutomation' };
      case '/templates':
        return { title: 'Email templates', btnLabel: 'New template', modal: 'addTemplate' };
      case '/campaigns':
        return { title: 'Campaigns', btnLabel: 'New campaign', modal: 'addCampaign' };
      case '/payments':
        return { title: 'Payments', btnLabel: 'Charge client', modal: 'chargeClient' };
      case '/invoices':
        return { title: 'Invoices', btnLabel: 'Create invoice', modal: 'addInvoice' };
      case '/reports':
        return { title: 'Reports', btnLabel: 'Export report', modal: null };
      case '/import':
        return { title: 'Import data', btnLabel: 'Import file', modal: null };
      case '/website':
        return { title: 'Website builder', btnLabel: 'Publish site', modal: null };
      case '/ai':
        return { title: 'AI assistant', btnLabel: 'New chat', modal: null };
      case '/users':
        return { title: 'Users & licenses', btnLabel: 'Add user', modal: 'addUser' };
      case '/integrations':
        return { title: 'Integrations', btnLabel: 'Connect app', modal: null };
      case '/settings':
        return { title: 'Settings', btnLabel: 'Save all', modal: null };
      case '/':
      case '/dashboard':
      default:
        return { title: 'Dashboard', btnLabel: 'Add contact', modal: 'addContact' };
    }
  };

  const config = getPageConfig();

  const handleAction = () => {
    if (config.modal) {
      openModal(config.modal);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-title">{config.title}</div>
      
      <div className="search-wrap">
        <i className="ti ti-search"></i>
        <input
          type="text"
          placeholder="Search Lansan CRM..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-primary" onClick={handleAction}>
          <i className={config.modal === 'addAutomation' ? 'ti ti-sparkles' : 'ti ti-plus'}></i>
          <span>{config.btnLabel}</span>
        </button>
      </div>
    </div>
  );
};
