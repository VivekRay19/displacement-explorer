import type { Metadata } from 'next';
import './globals.css';
import { ResearchProvider } from '@/lib/storage/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SourceTraceDrawer } from '@/components/source-trace/SourceTraceDrawer';

export const metadata: Metadata = {
  title: 'Displacement Explorer — Understanding displacement through evidence',
  description: 'An academic research companion and visualization platform for global forced displacement data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#fcfbf9] text-[#1e293b]">
        <ResearchProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SourceTraceDrawer />
        </ResearchProvider>
      </body>
    </html>
  );
}
