'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCRM } from '@/components/providers/CRMProvider';
import { Logo } from '@/components/ui/Logo';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, userTasks, userAppointments, switchUser, users } = useCRM();

  const openTaskCount = userTasks.filter((t) => !t.done).length;
  const pendingApptCount = userAppointments.filter((a) => a.status === 'Pending' || a.date === 'Today').length;

  // Build role-specific navigation menus
  const getNavSections = () => {
    if (currentUser.role === 'Agent') {
      return [
        {
          title: 'Sales Workspace',
          items: [
            { href: '/dashboard', label: 'My Dashboard', iconClass: 'ti ti-layout-dashboard' },
            { href: '/contacts', label: 'My Contacts', iconClass: 'ti ti-users' },
            { href: '/pipeline', label: 'My Pipeline', iconClass: 'ti ti-chart-bar' },
            { href: '/tasks', label: 'My Tasks', iconClass: 'ti ti-checkbox', badge: openTaskCount },
          ],
        },
        {
          title: 'Leads & Booking',
          items: [
            { href: '/leads', label: 'My Leads', iconClass: 'ti ti-target' },
            { href: '/appointments', label: 'Appointments', iconClass: 'ti ti-calendar-event', badge: pendingApptCount },
            { href: '/book/' + (currentUser.username || 'latoya'), label: 'My Booking Page', iconClass: 'ti ti-calendar-time' },
          ],
        },
        {
          title: 'Tools & Account',
          items: [
            { href: '/ai', label: 'AI Assistant', iconClass: 'ti ti-sparkles' },
            { href: '/', label: 'Public Homepage', iconClass: 'ti ti-home-2' },
            { href: '/login', label: 'Sign Out', iconClass: 'ti ti-logout' },
          ],
        },
      ];
    }

    if (currentUser.role === 'Manager') {
      return [
        {
          title: 'Main',
          items: [
            { href: '/dashboard', label: 'Manager Dashboard', iconClass: 'ti ti-layout-dashboard' },
            { href: '/contacts', label: 'Team Contacts', iconClass: 'ti ti-users' },
            { href: '/pipeline', label: 'Team Pipeline', iconClass: 'ti ti-chart-bar' },
            { href: '/tasks', label: 'Team Tasks', iconClass: 'ti ti-checkbox', badge: openTaskCount },
          ],
        },
        {
          title: 'Growth & Booking',
          items: [
            { href: '/leads', label: 'Lead Generation', iconClass: 'ti ti-target' },
            { href: '/appointments', label: 'Appointments', iconClass: 'ti ti-calendar-event', badge: pendingApptCount },
            { href: '/book/' + (currentUser.username || 'latoya'), label: 'My Booking Page', iconClass: 'ti ti-calendar-time' },
          ],
        },
        {
          title: 'Marketing & Finance',
          items: [
            { href: '/templates', label: 'Email Templates', iconClass: 'ti ti-template' },
            { href: '/campaigns', label: 'Campaigns', iconClass: 'ti ti-speakerphone' },
            { href: '/invoices', label: 'Invoices', iconClass: 'ti ti-file-invoice' },
            { href: '/reports', label: 'Reports & Analytics', iconClass: 'ti ti-chart-line' },
          ],
        },
        {
          title: 'Tools & Admin',
          items: [
            { href: '/', label: 'Public Homepage', iconClass: 'ti ti-home-2' },
            { href: '/import', label: 'Import Data', iconClass: 'ti ti-database-import' },
            { href: '/ai', label: 'AI Assistant', iconClass: 'ti ti-sparkles' },
            { href: '/settings', label: 'Settings', iconClass: 'ti ti-settings' },
            { href: '/login', label: 'Sign Out', iconClass: 'ti ti-logout' },
          ],
        },
      ];
    }

    // Default Admin View (Full Access)
    return [
      {
        title: 'Executive Main',
        items: [
          { href: '/dashboard', label: 'Executive Dashboard', iconClass: 'ti ti-layout-dashboard' },
          { href: '/contacts', label: 'All Contacts', iconClass: 'ti ti-users' },
          { href: '/pipeline', label: 'Global Pipeline', iconClass: 'ti ti-chart-bar' },
          { href: '/tasks', label: 'All Tasks', iconClass: 'ti ti-checkbox', badge: openTaskCount },
        ],
      },
      {
        title: 'Growth & Booking',
        items: [
          { href: '/leads', label: 'Lead Generation', iconClass: 'ti ti-target' },
          { href: '/appointments', label: 'Appointments', iconClass: 'ti ti-calendar-event', badge: pendingApptCount },
          { href: '/book/' + (currentUser.username || 'latoya'), label: 'My Booking Page', iconClass: 'ti ti-calendar-time' },
        ],
      },
      {
        title: 'Marketing & Automations',
        items: [
          { href: '/automations', label: 'Automations', iconClass: 'ti ti-bolt' },
          { href: '/templates', label: 'Email Templates', iconClass: 'ti ti-template' },
          { href: '/campaigns', label: 'Campaigns', iconClass: 'ti ti-speakerphone' },
        ],
      },
      {
        title: 'Finance & Invoicing',
        items: [
          { href: '/payments', label: 'Payments', iconClass: 'ti ti-credit-card' },
          { href: '/invoices', label: 'Invoices & PDF', iconClass: 'ti ti-file-invoice' },
          { href: '/reports', label: 'Executive Reports', iconClass: 'ti ti-chart-line' },
        ],
      },
      {
        title: 'Tools & Web',
        items: [
          { href: '/', label: 'Public Homepage', iconClass: 'ti ti-home-2' },
          { href: '/website', label: 'Landing Page Builder', iconClass: 'ti ti-world' },
          { href: '/import', label: 'Import Data', iconClass: 'ti ti-database-import' },
          { href: '/ai', label: 'AI Assistant', iconClass: 'ti ti-sparkles' },
        ],
      },
      {
        title: 'Admin Governance',
        items: [
          { href: '/users', label: 'Users & Licenses', iconClass: 'ti ti-lock' },
          { href: '/integrations', label: 'Integrations', iconClass: 'ti ti-plug' },
          { href: '/settings', label: 'Settings', iconClass: 'ti ti-settings' },
          { href: '/login', label: 'Sign Out', iconClass: 'ti ti-logout' },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
    return pathname === href;
  };

  return (
    <div className="sidebar" style={{ width: '210px', maxWidth: '210px', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Brand Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
          <Logo size="md" />
        </Link>
      </div>

      {/* Role Badge Indicator */}
      <div style={{ padding: '10px 12px', background: '#fafafa', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: '6px', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentUser.avatarColor || '#1D9E75', flexShrink: 0 }} />
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentUser.role} Navigation
        </span>
      </div>

      {/* Navigation Links */}
      <div className="nav" style={{ padding: '6px', overflowX: 'hidden' }}>
        {navSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '8px' }}>
            <div className="nav-section" style={{ padding: '10px 8px 3px', fontSize: '10px', fontWeight: 600, color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 9px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: active ? '#0F6E56' : '#555555',
                    background: active ? '#e8f8f2' : 'transparent',
                    fontWeight: active ? 600 : 500,
                    textDecoration: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    marginBottom: '1px',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  <i className={item.iconClass} style={{ fontSize: '16px', flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="nav-badge" style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 600, flexShrink: 0, marginLeft: 'auto' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active User Footer Card */}
      <div style={{ padding: '12px', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentUser.avatarColor || '#e8f8f2', color: '#0F6E56', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
            <div style={{ fontSize: '10px', color: '#888888', fontWeight: 500 }}>{currentUser.role}</div>
          </div>
        </div>
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '4px 7px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#c0392b',
            textDecoration: 'none',
            transition: 'all 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: '14px' }} />
          <span>Sign out</span>
        </Link>
      </div>
    </div>
  );
};
