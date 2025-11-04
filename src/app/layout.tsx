
import './globals.css';
import '@/components/TargetCursor.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';
import LiquidEtherBackground from '@/components/liquid-ether-background';

export const metadata = {
  title: 'devswap v1',
  description: 'Swap skills, gain knowledge, and connect with a community of learners and mentors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LiquidEtherBackground />
        <AppProviders>
          <main style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </main>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
