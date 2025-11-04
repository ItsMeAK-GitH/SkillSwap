
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, Upload, PlusCircle, Trash2, BookOpen, Target, Repeat, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase/auth/use-user';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ALL_SKILLS } from '@/lib/skills';

interface Skill {
  name: string;
  verified: boolean;
}

export default function ProfilePage() {
  const { user, profile: userProfile, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');

  const [teachSuggestions, setTeachSuggestions] = useState<string[]>([]);
  const [learnSuggestions, setLearnSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);

  const handleSuggestions = useCallback((inputValue: string, skillType: 'teach' | 'learn') => {
    if (!inputValue.trim()) {
        if (skillType === 'teach') setTeachSuggestions([]);
        else setLearnSuggestions([]);
        return;
    }

    const existingSkills = skillType === 'teach'
        ? new Set(userProfile?.skillsToTeach.map(s => s.name.toLowerCase()) || [])
        : new Set(userProfile?.skillsToLearn.map(s => s.name.toLowerCase()) || []);

    const filtered = ALL_SKILLS.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !existingSkills.has(skill.toLowerCase())
    );
    
    const suggestions = filtered.slice(0, 5);

    if (skillType === 'teach') setTeachSuggestions(suggestions);
    else setLearnSuggestions(suggestions);
  }, [userProfile]);

  useEffect(() => {
    const debounce = setTimeout(() => handleSuggestions(newSkillToTeach, 'teach'), 100);
    return () => clearTimeout(debounce);
  }, [newSkillToTeach, handleSuggestions]);

  useEffect(() => {
    const debounce = setTimeout(() => handleSuggestions(newSkillToLearn, 'learn'), 100);
    return () => clearTimeout(debounce);
  }, [newSkillToLearn, handleSuggestions]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  const handleAddSkill = (skillType: 'skillsToTeach' | 'skillsToLearn', skillName: string) => {
    if (!userDocRef) return;
    
    const trimmedSkillName = skillName.trim();
    if (trimmedSkillName === '') return;

    if (skillType === 'skillsToTeach') {
        if (userProfile?.skillsToTeach.some(s => s.name.toLowerCase() === trimmedSkillName.toLowerCase())) return;
        const newSkill: Skill = { name: trimmedSkillName, verified: false };
        updateDocumentNonBlocking(userDocRef, { skillsToTeach: arrayUnion(newSkill) });
        setNewSkillToTeach('');
        setTeachSuggestions([]);
    } else {
        if (userProfile?.skillsToLearn.some(s => s.name.toLowerCase() === trimmedSkillName.toLowerCase())) return;
        const newSkill = { name: trimmedSkillName };
        updateDocumentNonBlocking(userDocRef, { skillsToLearn: arrayUnion(newSkill) });
        setNewSkillToLearn('');
        setLearnSuggestions([]);
    }
  };

  const handleRemoveSkill = (skillType: 'skillsToTeach' | 'skillsToLearn', skillToRemove: Skill | {name: string}) => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      [skillType]: arrayRemove(skillToRemove),
    });
  };

  const handleVerifyClick = (skillName: string) => {
    router.push(`/verify-skill?skill=${encodeURIComponent(skillName)}`);
  };
  
  const isLoading = isUserLoading;

  const renderSkillToTeach = (skill: Skill) => (
    <div key={skill.name} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3">
            {skill.verified ? (
                <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
            ) : (
                <div className="w-5 h-5" /> // Placeholder for alignment
            )}
            <span className="font-medium text-foreground">{skill.name}</span>
            {skill.verified && (
                <Badge variant="outline" className="text-accent border-accent/50 text-xs">Verified</Badge>
            )}
        </div>
        <div className="flex items-center gap-2">
            {!skill.verified && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyClick(skill.name)}
                    className="text-accent border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Verify
                </Button>
            )}
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive cursor-target" onClick={() => handleRemoveSkill('skillsToTeach', skill)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );

  const renderSkillToLearn = (skill: { name: string }) => (
    <div key={skill.name} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-muted/50">
        <span className="font-medium text-foreground">{skill.name}</span>
        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive cursor-target" onClick={() => handleRemoveSkill('skillsToLearn', skill)}>
            <Trash2 className="h-4 w-4" />
        </Button>
    </div>
  );

  const renderStatCard = (icon: React.ReactNode, label: string, value: number | string | React.ReactNode) => (
    <div className="flex items-center p-4 bg-background rounded-lg">
      <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 mb-12 text-center">
                {isLoading ? (
                    <>
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-48 mx-auto" />
                            <Skeleton className="h-7 w-64 mx-auto" />
                        </div>
                    </>
                ) : (
                    <>
                        <Avatar className="w-32 h-32 text-5xl ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                            <AvatarImage src={userProfile?.photoURL || user?.photoURL || undefined} alt={userProfile?.name || ''} />
                            <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-4xl font-bold font-headline">{userProfile?.name}</h1>
                            <p className="text-lg text-muted-foreground mt-1 font-headline">{userProfile?.email}</p>
                        </div>
                    </>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* About Me Card */}
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{userProfile?.bio || "No bio provided."}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {isLoading ? (
                               Array.from({ length: 3 }).map((_, i) => (
                                   <div key={i} className="flex items-center p-4 bg-background rounded-lg">
                                        <Skeleton className="h-12 w-12 rounded-full mr-4"/>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20"/>
                                            <Skeleton className="h-6 w-8"/>
                                        </div>
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
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Skills I Can Teach Card */}
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Skills I Can Teach</CardTitle>
                            <CardDescription>Manage the skills you can offer to others.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="e.g., React, Guitar..."
                                    value={newSkillToTeach}
                                    onChange={(e) => setNewSkillToTeach(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToTeach', newSkillToTeach)}
                                />
                                <Button onClick={() => handleAddSkill('skillsToTeach', newSkillToTeach)} aria-label="Add skill to teach">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 min-h-[28px]">
                                {isSuggesting && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {teachSuggestions.map(suggestion => (
                                    <Button key={suggestion} size="sm" variant="outline" className="h-7" onClick={() => handleAddSkill('skillsToTeach', suggestion)}>
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3">
                                            <Skeleton className="h-6 w-28" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    ))
                                ) : userProfile?.skillsToTeach?.length ? (
                                    userProfile.skillsToTeach.map(renderSkillToTeach)
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center p-4">No skills added yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills I Want to Learn Card */}
                    <Card className="bg-card/70 border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Skills I Want to Learn</CardTitle>
                            <CardDescription>List the skills you are interested in acquiring.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="e.g., Python, Photography..."
                                    value={newSkillToLearn}
                                    onChange={(e) => setNewSkillToLearn(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToLearn', newSkillToLearn)}
                                />
                                <Button onClick={() => handleAddSkill('skillsToLearn', newSkillToLearn)} aria-label="Add skill to learn">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                             <div className="flex flex-wrap gap-1 min-h-[28px]">
                                {isSuggesting && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {learnSuggestions.map(suggestion => (
                                    <Button key={suggestion} size="sm" variant="outline" className="h-7" onClick={() => handleAddSkill('skillsToLearn', suggestion)}>
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                {isLoading ? (
                                    Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3">
                                            <Skeleton className="h-6 w-36" />
                                            <Skeleton className="h-8 w-10" />
                                        </div>
                                    ))
                                ) : userProfile?.skillsToLearn?.length ? (
                                    userProfile.skillsToLearn.map(renderSkillToLearn)
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center p-4">No skills added yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
