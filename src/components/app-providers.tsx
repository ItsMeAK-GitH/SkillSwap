
'use client';

import { FirebaseClientProvider } from '@/firebase';
import { UserProvider } from '@/firebase/auth/use-user';
import { LenisProvider } from '@/components/lenis-provider';
import TargetCursor from '@/components/TargetCursor';

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <FirebaseClientProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </FirebaseClientProvider>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />
    </LenisProvider>
  );
}
