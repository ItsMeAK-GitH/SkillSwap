'use client';

import { use } from 'react';
import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import ChatInterface from '@/components/ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
    name: string;
    photoURL: string;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId: otherUserId } = use(params);
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const otherUserDocRef = useMemoFirebase(() => (otherUserId ? doc(firestore, 'users', otherUserId) : null), [otherUserId, firestore]);
  const { data: otherUser, isLoading: isLoadingUser } = useDoc<UserProfile>(otherUserDocRef);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20 md:pt-28 flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl flex-1 flex flex-col">
            {isLoadingUser ? (
                <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                </div>
            ) : otherUser && (
                 <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/chat" className="p-2 -ml-2 rounded-full hover:bg-muted cursor-target">
                            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                        </Link>
                        <Link href={`/profile/${otherUserId}`} className="flex items-center gap-4 cursor-target">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={otherUser.photoURL} alt={otherUser.name} />
                                <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold font-headline">{otherUser.name}</h2>
                        </Link>
                    </div>
                </div>
            )}
           
            <div className="flex-1">
                 {currentUser && otherUser ? (
                    <ChatInterface
                        currentUser={currentUser}
                        otherUser={{ id: otherUserId, ...otherUser }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Skeleton className="h-[600px] w-full rounded-lg" />
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
