import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SupabaseProvider } from '@/components/providers/supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xhap - Xhosa Hip Hop Platform',
  description: 'Iplatform yabarhapi baseKhaya - The home of Xhosa Hip Hop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="xh" className="dark">
      <body className={inter.className}>
        <SupabaseProvider>
          <SiteHeader />
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}