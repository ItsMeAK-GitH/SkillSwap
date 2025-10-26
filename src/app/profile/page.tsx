
'use client';

import { useState } from 'react';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{
    name: string;
    email: string;
    photoURL: string;
    skillsToTeach: string[];
    skillsToLearn: string[];
  }>(userDocRef);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  const handleAddSkill = (skillType: 'skillsToTeach' | 'skillsToLearn') => {
    if (!userDocRef) return;
    const skillToAdd = skillType === 'skillsToTeach' ? newSkillToTeach : newSkillToLearn;
    if (skillToAdd.trim() === '') return;

    updateDocumentNonBlocking(userDocRef, {
      [skillType]: arrayUnion(skillToAdd.trim()),
    });

    if (skillType === 'skillsToTeach') {
      setNewSkillToTeach('');
    } else {
      setNewSkillToLearn('');
    }
  };

  const handleRemoveSkill = (skillType: 'skillsToTeach' | 'skillsToLearn', skillToRemove: string) => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      [skillType]: arrayRemove(skillToRemove),
    });
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto bg-card/70 border-border/50">
            <CardHeader className="text-center p-8 border-b border-border/50">
              {isLoading ? (
                 <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-64" />
                 </div>
              ) : (
                <>
                <div className="flex justify-center">
                    <Avatar className="w-24 h-24 text-3xl mb-4 ring-4 ring-primary/50">
                        <AvatarImage src={userProfile?.photoURL || user?.photoURL || undefined} alt={userProfile?.name || ''} />
                        <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-3xl font-headline">{userProfile?.name}</CardTitle>
                <p className="text-muted-foreground">{userProfile?.email}</p>
                </>
              )}
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Skills to Teach */}
              <div>
                <h3 className="text-xl font-headline mb-4">Skills I Can Teach</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="e.g., React"
                    value={newSkillToTeach}
                    onChange={(e) => setNewSkillToTeach(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToTeach')}
                  />
                  <Button onClick={() => handleAddSkill('skillsToTeach')}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-32 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                    </>
                  ) : (
                    userProfile?.skillsToTeach?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-base py-1 pl-3 pr-2">
                        {skill}
                        <button onClick={() => handleRemoveSkill('skillsToTeach', skill)} className="ml-2 rounded-full hover:bg-background/50 p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              
              {/* Skills to Learn */}
              <div>
                <h3 className="text-xl font-headline mb-4">Skills I Want to Learn</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="e.g., Python"
                    value={newSkillToLearn}
                    onChange={(e) => setNewSkillToLearn(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToLearn')}
                  />
                  <Button onClick={() => handleAddSkill('skillsToLearn')}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-36 rounded-full" />
                    </>
                  ) : (
                    userProfile?.skillsToLearn?.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-base py-1 pl-3 pr-2 border-primary/50 text-primary">
                        {skill}
                        <button onClick={() => handleRemoveSkill('skillsToLearn', skill)} className="ml-2 rounded-full hover:bg-background/50 p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
