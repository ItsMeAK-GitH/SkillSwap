
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Send, Bot, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifySkillInteractive, VerifySkillInteractiveOutput } from '@/ai/flows/verify-skill-interactive';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase/auth/use-user';

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

type VerificationStatus = 'IDLE' | 'ANALYZING' | 'AWAITING_USER_INPUT' | 'VERIFIED' | 'FAILED';

function VerifySkillPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillToVerify = searchParams.get('skill');
  const firestore = useFirestore();
  const { user, profile: userProfile, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();
  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certificateDataUri, setCertificateDataUri] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('IDLE');

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !skillToVerify) {
        router.push('/profile');
      } else {
        setMessages([{ sender: 'ai', text: `Hello! I'm here to help you verify your skill: **${skillToVerify}**. Please upload your certificate to begin.` }]);
      }
    }
  }, [isUserLoading, user, skillToVerify, router]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile || !skillToVerify) return;

    setVerificationStatus('ANALYZING');
    setMessages(prev => [...prev, { sender: 'ai', text: 'Analyzing your certificate... This may take a moment.' }]);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        setCertificateDataUri(dataUri);

        const result = await verifySkillInteractive({
          userName: userProfile.name,
          skillToVerify,
          certificateDataUri: dataUri,
        });

        handleAIResponse(result);
      };
    } catch (error) {
      handleVerificationError(error);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || verificationStatus !== 'AWAITING_USER_INPUT' || !certificateDataUri || !userProfile || !skillToVerify) return;

    const newUserMessage: Message = { sender: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setVerificationStatus('ANALYZING');

    try {
      const result = await verifySkillInteractive({
        userName: userProfile.name,
        skillToVerify,
        certificateDataUri,
        userMessage: newUserMessage.text,
      });

      handleAIResponse(result);
    } catch (error) {
      handleVerificationError(error);
    }
  };

  const handleAIResponse = (result: VerifySkillInteractiveOutput) => {
    setMessages(prev => [...prev, { sender: 'ai', text: result.messageToUser }]);

    if (result.status === 'VERIFIED') {
      setVerificationStatus('VERIFIED');
      updateFirestoreSkillVerification(true);
      toast({ title: 'Skill Verified!', description: `Congratulations, your ${skillToVerify} skill is now verified.` });
    } else if (result.status === 'FAILED') {
      setVerificationStatus('FAILED');
      toast({ variant: 'destructive', title: 'Verification Failed', description: result.reason });
    } else if (result.status === 'NEEDS_MORE_INFO') {
      setVerificationStatus('AWAITING_USER_INPUT');
    }
  };

  const handleVerificationError = (error: any) => {
    console.error("Verification failed", error);
    const errorMessage = "I'm sorry, an unexpected error occurred. Please try uploading the certificate again.";
    setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }]);
    setVerificationStatus('IDLE');
    setCertificateDataUri(null);
    toast({
      variant: "destructive",
      title: "Verification Error",
      description: "Something went wrong. Please try again.",
    });
  };

  const updateFirestoreSkillVerification = async (verified: boolean) => {
    if (!userDocRef || !userProfile) return;
    try {
      const updatedSkills = userProfile.skillsToTeach.map(skill =>
        skill.name === skillToVerify ? { ...skill, verified } : skill
      );
      await updateDoc(userDocRef, { skillsToTeach: updatedSkills });
    } catch (error) {
      console.error("Failed to update skill in Firestore", error);
    }
  };

  const isProcessing = verificationStatus === 'ANALYZING';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Skill Verification</CardTitle>
              <CardDescription>Verify your "{skillToVerify}" skill with our AI assistant.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chat Area */}
              <div className="h-[400px] border rounded-lg p-4 space-y-4 overflow-y-auto flex flex-col mb-4 bg-background/50">
                {isUserLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-3/4 self-end" />
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                      {msg.sender === 'ai' && <Avatar className="w-8 h-8 bg-primary text-primary-foreground"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>}
                      <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.sender === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                      {msg.sender === 'user' && <Avatar className="w-8 h-8"><AvatarFallback><User size={20} /></AvatarFallback></Avatar>}
                    </div>
                  ))
                )}
                 {isProcessing && (
                    <div className="flex items-start gap-3">
                         <Avatar className="w-8 h-8 bg-primary text-primary-foreground"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>
                         <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                            <p className="text-sm">Thinking...</p>
                         </div>
                    </div>
                )}
              </div>

              {/* Input Area */}
              {verificationStatus === 'VERIFIED' ? (
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                  <CheckCircle className="mx-auto h-12 w-12 mb-2"/>
                  <h3 className="font-bold">Skill Verified!</h3>
                  <p>You can now close this page.</p>
                   <Button onClick={() => router.push('/profile')} className="mt-4">Back to Profile</Button>
                </div>
              ) : verificationStatus === 'FAILED' ? (
                 <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  <XCircle className="mx-auto h-12 w-12 mb-2"/>
                  <h3 className="font-bold">Verification Failed</h3>
                  <p>You can try again with a different document if you'd like.</p>
                   <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
                </div>
              ) : !certificateDataUri ? (
                <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 text-lg" disabled={isProcessing}>
                  <Upload className="mr-2"/> {isProcessing ? 'Analyzing...' : 'Upload Certificate'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your response here..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={verificationStatus !== 'AWAITING_USER_INPUT' || isProcessing}
                  />
                  <Button onClick={handleSendMessage} disabled={verificationStatus !== 'AWAITING_USER_INPUT' || isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Send />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, application/pdf"
      />
    </div>
  );
}


export default function VerifySkillPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifySkillPageContent />
        </Suspense>
    );
}
