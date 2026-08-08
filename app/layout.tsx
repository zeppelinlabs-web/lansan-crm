import type { Metadata } from 'next';
import './globals.css';
import { CRMProvider } from '@/components/providers/CRMProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlobalModals } from '@/components/layout/GlobalModals';

export const metadata: Metadata = {
  title: 'LanSan CRM — Internal Sales Platform',
  description: 'Internal CRM platform for LanSan team: manage leads, track pipelines, automate campaigns, and handle client invoicing.',
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
          <AppLayout>{children}</AppLayout>
          <GlobalModals />
        </CRMProvider>
      </body>
    </html>
  );
}
