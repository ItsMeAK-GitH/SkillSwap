
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LenisProvider } from '@/components/lenis-provider';
import MatrixRain from '@/components/matrix-rain';
import { FirebaseClientProvider } from '@/firebase';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SkillSwap</title>
        <meta name="description" content="Swap skills, gain knowledge, and connect with a community of learners and mentors." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <LenisProvider>
            <MatrixRain />
            {children}
            <Toaster />
          </LenisProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
