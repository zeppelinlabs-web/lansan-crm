'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCRM } from '@/components/providers/CRMProvider';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { tasks, appointments } = useCRM();

  const openTaskCount = tasks.filter((t) => !t.done).length;
  const pendingApptCount = appointments.filter((a) => a.status === 'Pending' || a.date === 'Today').length;

  const navSections = [
    {
      title: 'Main',
      items: [
        { href: '/dashboard', label: 'Dashboard', iconClass: 'ti ti-layout-dashboard' },
        { href: '/contacts', label: 'Contacts', iconClass: 'ti ti-users' },
        { href: '/pipeline', label: 'Pipeline', iconClass: 'ti ti-chart-bar' },
        { href: '/tasks', label: 'Tasks', iconClass: 'ti ti-checkbox', badge: openTaskCount },
      ],
    },
    {
      title: 'Growth',
      items: [
        { href: '/leads', label: 'Lead generation', iconClass: 'ti ti-target' },
        { href: '/appointments', label: 'Appointments', iconClass: 'ti ti-calendar-event', badge: pendingApptCount },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { href: '/automations', label: 'Automations', iconClass: 'ti ti-bolt' },
        { href: '/templates', label: 'Email templates', iconClass: 'ti ti-template' },
        { href: '/campaigns', label: 'Campaigns', iconClass: 'ti ti-speakerphone' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { href: '/payments', label: 'Payments', iconClass: 'ti ti-credit-card' },
        { href: '/invoices', label: 'Invoices', iconClass: 'ti ti-file-invoice' },
      ],
    },
    {
      title: 'Insights',
      items: [
        { href: '/reports', label: 'Reports', iconClass: 'ti ti-chart-line' },
      ],
    },
    {
      title: 'Tools',
      items: [
        { href: '/import', label: 'Import data', iconClass: 'ti ti-database-import' },
        { href: '/website', label: 'Website builder', iconClass: 'ti ti-world' },
        { href: '/ai', label: 'AI assistant', iconClass: 'ti ti-sparkles' },
      ],
    },
    {
      title: 'Admin',
      items: [
        { href: '/users', label: 'Users & licenses', iconClass: 'ti ti-lock' },
        { href: '/integrations', label: 'Integrations', iconClass: 'ti ti-plug' },
        { href: '/settings', label: 'Settings', iconClass: 'ti ti-settings' },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
    return pathname === href;
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-mark">L</div>
        <div>
          <div className="logo-name">Lansan</div>
          <div className="logo-tag">CRM Platform</div>
        </div>
      </div>
      <div className="nav">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="nav-section">{section.title}</div>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                >
                  <i className={item.iconClass}></i>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-row">
          <div className="avatar-sm">LA</div>
          <div>
            <div className="user-name">LaToya</div>
            <div className="user-role">Admin · Lansan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
