'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconUsers,
  IconChartBar,
  IconCheckbox,
  IconTarget,
  IconCalendarEvent,
  IconBolt,
  IconTemplate,
  IconSpeakerphone,
  IconCreditCard,
  IconFileInvoice,
  IconChartLine,
  IconDatabaseImport,
  IconWorld,
  IconSparkles,
  IconLock,
  IconPlug,
  IconSettings,
} from '@tabler/icons-react';
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
        { href: '/dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={16} /> },
        { href: '/contacts', label: 'Contacts', icon: <IconUsers size={16} /> },
        { href: '/pipeline', label: 'Pipeline', icon: <IconChartBar size={16} /> },
        { href: '/tasks', label: 'Tasks', icon: <IconCheckbox size={16} />, badge: openTaskCount },
      ],
    },
    {
      title: 'Growth',
      items: [
        { href: '/leads', label: 'Lead generation', icon: <IconTarget size={16} /> },
        { href: '/appointments', label: 'Appointments', icon: <IconCalendarEvent size={16} />, badge: pendingApptCount },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { href: '/automations', label: 'Automations', icon: <IconBolt size={16} /> },
        { href: '/templates', label: 'Email templates', icon: <IconTemplate size={16} /> },
        { href: '/campaigns', label: 'Campaigns', icon: <IconSpeakerphone size={16} /> },
      ],
    },
    {
      title: 'Finance',
      items: [
        { href: '/payments', label: 'Payments', icon: <IconCreditCard size={16} /> },
        { href: '/invoices', label: 'Invoices', icon: <IconFileInvoice size={16} /> },
      ],
    },
    {
      title: 'Insights',
      items: [
        { href: '/reports', label: 'Reports', icon: <IconChartLine size={16} /> },
      ],
    },
    {
      title: 'Tools',
      items: [
        { href: '/import', label: 'Import data', icon: <IconDatabaseImport size={16} /> },
        { href: '/website', label: 'Website builder', icon: <IconWorld size={16} /> },
        { href: '/ai', label: 'AI assistant', icon: <IconSparkles size={16} /> },
      ],
    },
    {
      title: 'Admin',
      items: [
        { href: '/users', label: 'Users & licenses', icon: <IconLock size={16} /> },
        { href: '/integrations', label: 'Integrations', icon: <IconPlug size={16} /> },
        { href: '/settings', label: 'Settings', icon: <IconSettings size={16} /> },
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
                  {item.icon}
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
