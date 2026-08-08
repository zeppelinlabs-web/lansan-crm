import type { Metadata } from 'next';
import './globals.css';
import { CRMProvider } from '@/components/providers/CRMProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlobalModals } from '@/components/layout/GlobalModals';

export const metadata: Metadata = {
  title: 'Lansan CRM — The All-in-One Sales & Automation Platform',
  description: 'Enterprise CRM for fast-growing sales teams, lead pipelines, automated campaigns, and financial management.',
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
