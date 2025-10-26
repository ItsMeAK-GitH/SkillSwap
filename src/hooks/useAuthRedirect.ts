'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to redirect authenticated users away from auth pages (e.g., /login, /signup).
 */
export function useAuthRedirect() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if authentication has been checked and a user object exists.
    if (!isUserLoading && user) {
      // Check if the current page is one of the authentication pages.
      if (pathname === '/login' || pathname === '/signup') {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router, pathname]);
}
