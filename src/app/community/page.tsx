'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
  bio?: string;
  email?: string;
  skillsToTeach: { name: string; verified: boolean }[];
  skillsToLearn: { name: string }[];
}

export default function CommunityPage() {
  const { user } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const usersCollectionRef = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading, error } = useCollection<UserProfile>(usersCollectionRef);

  const getHandleFromEmail = (email: string | null | undefined) => {
    if (!email) return 'devswapper';
    return email.split('@')[0];
  };
  
  const getMostRelevantSkill = (skills: {name: string}[]) => {
    if (!skills || skills.length === 0) return 'Learner & Teacher';
    return skills[0].name;
  }

  const handleProposeSwap = (otherUserId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Navigate to the dedicated chat page.
    router.push(`/chat/${otherUserId}`);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Meet the Community
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              Browse all the talented members of the DevSwap network.
            </p>
          </div>

          <div className="mt-16">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                   <div key={i} className="w-full h-[420px] bg-muted/20 rounded-[30px] animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-400">
                <Users className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-xl font-semibold">Error Loading Community</h3>
                <p className="mt-2 text-red-400/80">There was a problem fetching the user list. It might be a permission issue.</p>
              </div>
            ) : users && users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((profile) => (
                   <ProfileCard
                      key={profile.id}
                      name={profile.name}
                      title={getMostRelevantSkill(profile.skillsToTeach)}
                      handle={getHandleFromEmail(profile.email)}
                      status="Online"
                      contactText="Message"
                      avatarUrl={profile.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.name}`}
                      showUserInfo={true}
                      enableTilt={true}
                      onContactClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProposeSwap(profile.id)
                      }}
                    />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">Community is Empty</h3>
                <p className="mt-2 text-muted-foreground">Looks like you're the first one here! Check back later as more users join.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
