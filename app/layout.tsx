import type { Metadata } from 'next';
import './globals.css';
import { CRMProvider } from '@/components/providers/CRMProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlobalModals } from '@/components/layout/GlobalModals';

export const metadata: Metadata = {
  title: 'Lansan CRM',
  description: 'Powerful business CRM platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css"
        />
      </head>
      <body>
        <CRMProvider>
          <div className="app-container">
            <Sidebar />
            <div className="main-container">
              <Topbar />
              <div className="content-area">{children}</div>
            </div>
          </div>
          <GlobalModals />
        </CRMProvider>
      </body>
    </html>
  );
}
