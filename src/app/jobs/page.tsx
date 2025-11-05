'use client';

import { useState, useEffect } from 'react';
import { useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError, useFirestore } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Repeat, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';

interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
  skillsToTeach: { name: string, verified: boolean }[];
  skillsToLearn: { name: string }[];
}

type Match = {
    userId: string;
    matchedSkillsToLearn: string[]; // Skills you can learn from them
    matchedSkillsToTeach: string[]; // Skills you can teach them
    user?: UserProfile;
};

export default function SwapPage() {
  const { user, profile: currentUserProfile, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isNavigating, setIsNavigating] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const findMatches = async () => {
      if (!currentUserProfile || !firestore) return;
      
      setIsLoadingMatches(true);
      setError(null);

      const usersRef = collection(firestore, 'users');
      
      getDocs(usersRef).then(querySnapshot => {
        const allUsers: UserProfile[] = [];
        querySnapshot.forEach(docSnap => {
          if (docSnap.id !== currentUserProfile.id) {
             const data = docSnap.data();
             allUsers.push({
                id: docSnap.id,
                name: data.name,
                photoURL: data.photoURL,
                skillsToTeach: data.skillsToTeach || [],
                skillsToLearn: data.skillsToLearn || [],
             });
          }
        });
        
        const yourSkillsToLearn = new Set(currentUserProfile.skillsToLearn.map(s => s.name.toLowerCase()));
        const yourSkillsToTeach = new Set(currentUserProfile.skillsToTeach.map(s => s.name.toLowerCase()));

        const foundMatches: Match[] = [];

        for (const otherUser of allUsers) {
            const theyCanTeach = otherUser.skillsToTeach.filter(skill => yourSkillsToLearn.has(skill.name.toLowerCase()));
            const theyWantToLearn = otherUser.skillsToLearn.filter(skill => yourSkillsToTeach.has(skill.name.toLowerCase()));
            
            if (theyCanTeach.length > 0 && theyWantToLearn.length > 0) {
                foundMatches.push({
                    userId: otherUser.id,
                    matchedSkillsToLearn: theyCanTeach.map(s => s.name),
                    matchedSkillsToTeach: theyWantToLearn.map(s => s.name),
                    user: otherUser,
                });
            }
        }
        
        setMatches(foundMatches);
        setIsLoadingMatches(false);

      }).catch(err => {
        const permissionError = new FirestorePermissionError({
            path: usersRef.path,
            operation: 'list',
        });
        setError(permissionError);
        errorEmitter.emit('permission-error', permissionError);
        setIsLoadingMatches(false);
      });
    };

    if (currentUserProfile) {
      findMatches();
    }
  }, [currentUserProfile, firestore]);

  const handleStartChat = (otherUserId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to start a chat.',
      });
      return;
    }

    setIsNavigating(otherUserId);
    // Navigate to the dedicated chat page.
    router.push(`/chat/${otherUserId}`);
  };


  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  const isLoading = isUserLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Find Your Perfect Swap
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              We've scanned the community to find skill-swap partners for you.
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            {isLoadingMatches || isLoading ? (
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="bg-card/70 border-border/50">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                 <div className="text-center py-16 text-red-400">
                    <Repeat className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-xl font-semibold">Error Finding Matches</h3>
                    <p className="mt-2 text-red-400/80">There was a problem fetching potential matches. This is likely a permissions issue.</p>
                    <Button onClick={() => window.location.reload()} className="mt-6">Try Again</Button>
                </div>
            ) : matches.length > 0 ? (
              <div className="space-y-6">
                {matches.map((match) => (
                  <Card key={match.userId} className="bg-card/70 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 text-2xl ring-2 ring-primary/20">
                                <AvatarImage src={match.user?.photoURL || ''} alt={match.user?.name || ''} />
                                <AvatarFallback>{getInitials(match.user?.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-2xl font-bold font-headline">{match.user?.name}</h3>
                            </div>
                        </div>
                         <Button 
                            variant="outline"
                            onClick={() => handleStartChat(match.userId)}
                            disabled={isNavigating === match.userId}
                            className="cursor-target"
                         >
                            {isNavigating === match.userId ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <MessageSquare className="mr-2 h-4 w-4" />
                            )}
                            Message
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">You Can Learn...</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkillsToLearn.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-base">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">You Can Teach...</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkillsToTeach.map(skill => (
                            <Badge key={skill} variant="default" className="text-base bg-accent hover:bg-accent/80">{skill}</Badge>

                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Repeat className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">No Matches Found Yet</h3>
                <p className="mt-2 text-muted-foreground">Try adding more skills to your profile or check back later as more users join!</p>
                <Button onClick={() => window.location.reload()} className="mt-6">Refresh Matches</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
