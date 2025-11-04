'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, DocumentData } from 'firebase/firestore';
import { useAuth, useDoc, useFirestore, useFirebase, useMemoFirebase } from '@/firebase';

export interface UserProfile extends DocumentData {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  skillsToTeach: { name: string; verified: boolean }[];
  skillsToLearn: { name: string }[];
  onboardingCompleted: boolean;
}

export interface UserHookResult {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserHookResult | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isUserLoading: isAuthLoading, userError: authError } = useFirebase();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (authUser ? doc(firestore, 'users', authUser.uid) : null),
    [authUser, firestore]
  );
  
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userDocRef);

  const value = useMemo(() => ({
    user: authUser,
    profile: profile,
    isLoading: isAuthLoading || isProfileLoading,
    error: authError || profileError,
  }), [authUser, profile, isAuthLoading, isProfileLoading, authError, profileError]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserHookResult => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
