
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_SKILLS } from '@/lib/skills';
import { useUser } from '@/firebase/auth/use-user';

const TOTAL_STEPS = 3;

interface Skill {
    name: string;
    verified: boolean;
}

export default function OnboardingPage() {
    const { user, profile: userProfile, isLoading: isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const [currentStep, setCurrentStep] = useState(1);

    const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);

    const [bio, setBio] = useState('');
    const [skillsToTeach, setSkillsToTeach] = useState<Skill[]>([]);
    const [skillsToLearn, setSkillsToLearn] = useState<{ name: string }[]>([]);
    const [newSkillToTeach, setNewSkillToTeach] = useState('');
    const [newSkillToLearn, setNewSkillToLearn] = useState('');
    
    const [teachSuggestions, setTeachSuggestions] = useState<string[]>([]);
    const [learnSuggestions, setLearnSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setBio(userProfile.bio || '');
            setSkillsToTeach(userProfile.skillsToTeach || []);
            setSkillsToLearn(userProfile.skillsToLearn || []);
        }
    }, [userProfile]);

    const handleSuggestions = useCallback((inputValue: string, skillType: 'teach' | 'learn') => {
        if (!inputValue.trim()) {
            if (skillType === 'teach') setTeachSuggestions([]);
            else setLearnSuggestions([]);
            return;
        }

        const existingSkills = skillType === 'teach'
            ? new Set(skillsToTeach.map(s => s.name.toLowerCase()))
            : new Set(skillsToLearn.map(s => s.name.toLowerCase()));

        const filtered = ALL_SKILLS.filter(skill =>
            skill.toLowerCase().includes(inputValue.toLowerCase()) &&
            !existingSkills.has(skill.toLowerCase())
        );

        const suggestions = filtered.slice(0, 5);
        if (skillType === 'teach') setTeachSuggestions(suggestions);
        else setLearnSuggestions(suggestions);
    }, [skillsToTeach, skillsToLearn]);


    useEffect(() => {
        const debounce = setTimeout(() => handleSuggestions(newSkillToTeach, 'teach'), 100);
        return () => clearTimeout(debounce);
    }, [newSkillToTeach, handleSuggestions]);
    
    useEffect(() => {
        const debounce = setTimeout(() => handleSuggestions(newSkillToLearn, 'learn'), 100);
        return () => clearTimeout(debounce);
    }, [newSkillToLearn, handleSuggestions]);

    const isLoading = isUserLoading;

    const handleNext = async () => {
        if (isLoading || !userDocRef) return;

        if (currentStep === 1) { // Update Bio
            updateDocumentNonBlocking(userDocRef, { bio });
        } else if (currentStep === 2) { // Update Skills to Teach
            // This is handled by add/remove functions
        } else if (currentStep === 3) { // Update Skills to Learn & Finish
            await updateDoc(userDocRef, { onboardingCompleted: true });
            router.push('/profile');
            return;
        }

        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAddSkill = (skillType: 'skillsToTeach' | 'skillsToLearn', skillName: string) => {
        if (!userDocRef) return;
        
        const trimmedSkillName = skillName.trim();
        if (trimmedSkillName === '') return;

        if (skillType === 'skillsToTeach') {
            if (skillsToTeach.some(s => s.name.toLowerCase() === trimmedSkillName.toLowerCase())) return;
            const newSkill: Skill = { name: trimmedSkillName, verified: false };
            setSkillsToTeach([...skillsToTeach, newSkill]);
            updateDocumentNonBlocking(userDocRef, { skillsToTeach: arrayUnion(newSkill) });
            setNewSkillToTeach('');
            setTeachSuggestions([]);
        } else {
            if (skillsToLearn.some(s => s.name.toLowerCase() === trimmedSkillName.toLowerCase())) return;
            const newSkill = { name: trimmedSkillName };
            setSkillsToLearn([...skillsToLearn, newSkill]);
            updateDocumentNonBlocking(userDocRef, { skillsToLearn: arrayUnion(newSkill) });
            setNewSkillToLearn('');
            setLearnSuggestions([]);
        }
    };

    const handleRemoveSkill = (skillType: 'skillsToTeach' | 'skillsToLearn', skillToRemove: Skill | {name: string}) => {
        if (!userDocRef) return;
        
        if (skillType === 'skillsToTeach') {
            setSkillsToTeach(skillsToTeach.filter(s => s.name !== (skillToRemove as Skill).name));
            updateDocumentNonBlocking(userDocRef, { skillsToTeach: arrayRemove(skillToRemove) });
        } else {
            setSkillsToLearn(skillsToLearn.filter(s => s.name !== skillToRemove.name));
            updateDocumentNonBlocking(userDocRef, { skillsToLearn: arrayRemove(skillToRemove) });
        }
    };

    const motionVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-headline text-muted-foreground">Welcome, {userProfile?.name || <Skeleton className="h-6 w-24 inline-block" />}!</h2>
                        <span className="text-sm text-muted-foreground">Step {currentStep} of {TOTAL_STEPS}</span>
                    </div>
                    <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />
                </CardHeader>
                <CardContent className="p-8 relative min-h-[350px]">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loading" {...motionVariants} className="absolute inset-0 p-8 space-y-4">
                                <Skeleton className="h-8 w-1/2"/>
                                <Skeleton className="h-24 w-full"/>
                                <Skeleton className="h-10 w-full"/>
                            </motion.div>
                        )}

                        {!isLoading && (
                            <>
                                {/* Step 1: Bio */}
                                {currentStep === 1 && (
                                    <motion.div key="step1" {...motionVariants}>
                                        <CardTitle className="text-3xl font-headline mb-2">Tell us about yourself</CardTitle>
                                        <CardDescription className="mb-6">A brief bio helps others connect with you. What are your passions?</CardDescription>
                                        <Textarea
                                            placeholder="I'm a software developer passionate about open-source and teaching others how to code..."
                                            className="min-h-[120px] text-base"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </motion.div>
                                )}

                                {/* Step 2: Skills to Teach */}
                                {currentStep === 2 && (
                                    <motion.div key="step2" {...motionVariants}>
                                        <CardTitle className="text-3xl font-headline mb-2">What skills can you teach?</CardTitle>
                                        <CardDescription className="mb-6">Add skills you're confident in sharing. You can verify them with certificates later.</CardDescription>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                placeholder="e.g., React, Guitar, Italian Cooking"
                                                value={newSkillToTeach}
                                                onChange={(e) => setNewSkillToTeach(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToTeach', newSkillToTeach)}
                                            />
                                            <Button onClick={() => handleAddSkill('skillsToTeach', newSkillToTeach)}>Add Skill</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-1 min-h-[28px] mb-4">
                                            {isSuggesting && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                            {teachSuggestions.map(suggestion => (
                                                <Button key={suggestion} size="sm" variant="outline" className="h-7" onClick={() => handleAddSkill('skillsToTeach', suggestion)}>
                                                    {suggestion}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-md bg-background/30 border">
                                            {skillsToTeach.map(skill => (
                                                <Badge key={skill.name} variant="secondary" className="text-base py-1 pl-3 pr-2">
                                                    {skill.name}
                                                    <button onClick={() => handleRemoveSkill('skillsToTeach', skill)} className="ml-2 rounded-full hover:bg-background/20 p-0.5">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Skills to Learn */}
                                {currentStep === 3 && (
                                    <motion.div key="step3" {...motionVariants}>
                                        <CardTitle className="text-3xl font-headline mb-2">What do you want to learn?</CardTitle>
                                        <CardDescription className="mb-6">List the skills you're excited to pick up from the community.</CardDescription>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                placeholder="e.g., Python, Photography, Public Speaking"
                                                value={newSkillToLearn}
                                                onChange={(e) => setNewSkillToLearn(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('skillsToLearn', newSkillToLearn)}
                                            />
                                            <Button onClick={() => handleAddSkill('skillsToLearn', newSkillToLearn)}>Add Skill</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-1 min-h-[28px] mb-4">
                                            {isSuggesting && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                            {learnSuggestions.map(suggestion => (
                                                <Button key={suggestion} size="sm" variant="outline" className="h-7" onClick={() => handleAddSkill('skillsToLearn', suggestion)}>
                                                    {suggestion}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-md bg-background/30 border">
                                             {skillsToLearn.map(skill => (
                                                <Badge key={skill.name} variant="outline" className="text-base py-1 pl-3 pr-2 border-primary/50 text-primary">
                                                    {skill.name}
                                                    <button onClick={() => handleRemoveSkill('skillsToLearn', skill)} className="ml-2 rounded-full hover:bg-background/50 p-0.5">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="flex justify-between mt-8 p-8 border-t border-border/50">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep === TOTAL_STEPS ? 'Finish & View Profile' : 'Next'}
                        {currentStep === TOTAL_STEPS ? <CheckCircle className="ml-2" /> : <ArrowRight className="ml-2" />}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
