
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ScheduleDetails {
    type: 'schedule';
    // other properties are not needed for this view
}

interface ChatMessage {
  id: string;
  members: string[];
  senderId: string;
  content: string | ScheduleDetails;
  timestamp: any;
  isRead: boolean;
}

interface UserProfile {
    id: string;
    name: string;
    photoURL?: string;
}

interface Conversation {
  otherUser: UserProfile;
  lastMessage: ChatMessage;
  unreadCount: number;
}

const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('');
};

function ConversationItem({ conversation }: { conversation: Conversation }) {
    const router = useRouter();

    const handleConversationClick = () => {
      // Navigate to the dedicated chat page
      router.push(`/chat/${conversation.otherUser.id}`);
    };

    const lastMessageContent = useMemo(() => {
        const content = conversation.lastMessage.content;
        if (typeof content === 'string') {
            return content;
        }
        if (typeof content === 'object' && content?.type === 'schedule') {
            return '📅 Meeting Request';
        }
        return '...';
    }, [conversation.lastMessage.content]);

    return (
        <div 
            onClick={handleConversationClick}
            className="flex items-center p-4 -mx-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 cursor-target"
        >
            <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src={conversation.otherUser.photoURL} alt={conversation.otherUser.name} />
                <AvatarFallback>{getInitials(conversation.otherUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <h4 className="font-semibold truncate">{conversation.otherUser.name}</h4>
                <p className={cn("text-sm truncate", conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {lastMessageContent}
                </p>
            </div>
            <div className="flex flex-col items-end text-xs text-muted-foreground ml-2">
                {conversation.lastMessage.timestamp?.toDate && (
                    <span className="mb-1 whitespace-nowrap">{formatDistanceToNow(conversation.lastMessage.timestamp.toDate(), { addSuffix: true })}</span>
                )}
                {conversation.unreadCount > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 text-xs text-primary-foreground bg-accent rounded-full font-bold">
                        {conversation.unreadCount}
                    </div>
                )}
            </div>
        </div>
    );
}

function ConversationSkeleton() {
    return (
        <div className="flex items-center p-4">
            <Skeleton className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export default function ChatsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // This query now ONLY filters by members, which is supported by the security rules without a composite index.
  const messagesQuery = useMemoFirebase(() => 
    user ? query(
      collection(firestore, 'messages'),
      where('members', 'array-contains', user.uid)
    ) : null,
    [user, firestore]
  );
  
  const { data: messages, isLoading: isLoadingMessages } = useCollection<ChatMessage>(messagesQuery);
  
  const allUsersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<UserProfile>(allUsersQuery);

  const conversations = useMemo(() => {
    if (!user || !messages || !allUsers) return [];

    const usersMap = new Map(allUsers.map(u => [u.id, u]));
    const conversationsMap = new Map<string, Conversation>();

    // Sort messages here on the client-side
    const sortedMessages = [...messages].sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
        return dateB - dateA; // Sort descending to find the last message
    });

    for (const message of sortedMessages) {
      const otherUserId = message.members.find(id => id !== user.uid);
      if (!otherUserId) continue;

      if (!conversationsMap.has(otherUserId)) {
        const otherUser = usersMap.get(otherUserId);
        if (!otherUser) continue;

        // Since we sorted descending, the first message we see for a user is the last one.
        conversationsMap.set(otherUserId, {
          otherUser,
          lastMessage: message,
          unreadCount: 0, // We'll calculate this in a separate loop for clarity
        });
      }
    }
    
    // Now, calculate unread counts
    for (const message of messages) {
        const otherUserId = message.members.find(id => id !== user.uid);
        if (!otherUserId) continue;

        const conv = conversationsMap.get(otherUserId);
        if (conv && !message.isRead && message.senderId === otherUserId) {
            conv.unreadCount++;
        }
    }

    return Array.from(conversationsMap.values());
  }, [user, messages, allUsers]);

  const isLoading = isLoadingMessages || isLoadingUsers;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-primary"/>
                        Your Conversations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="divide-y divide-border/50">
                            {Array.from({ length: 3 }).map((_, i) => <ConversationSkeleton key={i} />)}
                        </div>
                    ) : conversations.length > 0 ? (
                        <div className="divide-y divide-border/50">
                           {conversations.map(conv => (
                               <ConversationItem key={conv.otherUser.id} conversation={conv} />
                           ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-xl font-semibold text-foreground">No Chats Yet</h3>
                            <p className="mt-2 text-muted-foreground">Find a swap or browse the community to start a conversation.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
