'use client';

import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Target, Repeat, Github, Linkedin, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface Skill {
  name: string;
  verified: boolean;
}

interface UserProfile {
    name: string;
    email: string;
    photoURL: string;
    bio: string;
    skillsToTeach: Skill[];
    skillsToLearn: { name: string }[];
    socialLinks?: {
        github?: string;
        linkedin?: string;
        website?: string;
    }
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = use(params);
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => (userId ? doc(firestore, 'users', userId) : null), [userId, firestore]);
  const { data: userProfile, isLoading } = useDoc<UserProfile>(userDocRef);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };
  
  const renderStatCard = (icon: React.ReactNode, label: string, value: number | string | React.ReactNode) => (
    <div className="flex items-center p-4 bg-background rounded-lg">
      <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
  
  const isOwnProfile = currentUser?.uid === userId;

  const handleStartChat = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    router.push(`/chat/${userId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 text-center md:text-left">
                {isLoading ? (
                    <>
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-48" />
                            <Skeleton className="h-7 w-64" />
                        </div>
                    </>
                ) : userProfile ? (
                    <>
                        <Avatar className="w-32 h-32 text-5xl ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                            <AvatarImage src={userProfile.photoURL || undefined} alt={userProfile.name || ''} />
                            <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold font-headline">{userProfile.name}</h1>
                            <p className="text-lg text-muted-foreground mt-1 font-headline">{userProfile.email}</p>
                            {!isOwnProfile && (
                                <Button onClick={handleStartChat} className="mt-4">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message {userProfile.name.split(' ')[0]}
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <p>User not found.</p>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader><CardTitle className="font-headline text-2xl">About</CardTitle></CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-20 w-full" />
                            ) : (
                                <p className="text-muted-foreground">{userProfile?.bio || "This user hasn't written a bio yet."}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 border-border/50">
                        <CardHeader><CardTitle className="font-headline text-2xl">Stats</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           {isLoading ? (
                               Array.from({ length: 3 }).map((_, i) => (
                                   <div key={i} className="flex items-center p-4 bg-background rounded-lg">
                                        <Skeleton className="h-12 w-12 rounded-full mr-4"/>
                                        <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-6 w-8"/></div>
                                   </div>
                               ))
                           ) : (
                            <>
                                {renderStatCard(<BookOpen/>, 'Skills Offered', userProfile?.skillsToTeach?.length || 0)}
                                {renderStatCard(<Target/>, 'Skills Wanted', userProfile?.skillsToLearn?.length || 0)}
                                {renderStatCard(<Repeat/>, 'Swaps Completed', 0)}
                            </>
                           )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 border-border/50">
                        <CardHeader><CardTitle className="font-headline text-2xl">Socials</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                           {isLoading ? <Skeleton className="h-24 w-full" /> : (
                            userProfile?.socialLinks && (userProfile.socialLinks.github || userProfile.socialLinks.linkedin || userProfile.socialLinks.website) ? (
                                <>
                                {userProfile.socialLinks.github && <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Github /> GitHub</a>}
                                {userProfile.socialLinks.linkedin && <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Linkedin /> LinkedIn</a>}
                                {userProfile.socialLinks.website && <a href={userProfile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><LinkIcon /> Website</a>}
                                </>
                            ) : <p className="text-muted-foreground text-sm">No social links provided.</p>
                           )}
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader><CardTitle className="font-headline text-2xl">Teaches</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {isLoading ? Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-8 w-24" />) 
                                : userProfile?.skillsToTeach.map(skill => <Badge key={skill.name} variant="secondary" className="text-base">{skill.name}</Badge>)
                            }
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 border-border/50">
                        <CardHeader><CardTitle className="font-headline text-2xl">Learns</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                             {isLoading ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-8 w-20" />) 
                                : userProfile?.skillsToLearn.map(skill => <Badge key={skill.name} variant="outline" className="text-base">{skill.name}</Badge>)
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
