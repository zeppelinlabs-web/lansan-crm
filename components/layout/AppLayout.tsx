'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Public standalone pages without internal CRM sidebar
  const isPublicPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/book' ||
    pathname === '/features' ||
    pathname === '/about' ||
    pathname === '/contact';

  if (isPublicPage) {
    return <div className="public-page-wrapper">{children}</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-container">
        <Topbar />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}
