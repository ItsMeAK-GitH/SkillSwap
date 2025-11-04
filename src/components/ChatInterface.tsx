
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, doc, writeBatch } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
    id?: string;
    senderId: string;
    content: string;
    timestamp: any; 
    members: string[];
    isRead: boolean;
}

interface OtherUser {
    id: string;
    name: string;
    photoURL?: string;
}

interface ChatInterfaceProps {
    currentUser: User;
    otherUser: OtherUser;
}

function getInitials(name: string | null | undefined) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
}

export default function ChatInterface({ currentUser, otherUser }: ChatInterfaceProps) {
    const firestore = useFirestore();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messagesQuery = useMemoFirebase(() => {
        if (!currentUser) return null;
        const chatMembers = [currentUser.uid, otherUser.id].sort();
        // This query now ONLY filters by members. The orderBy is removed to avoid needing a composite index.
        return query(
            collection(firestore, 'messages'),
            where('members', '==', chatMembers)
        );
    }, [firestore, currentUser, otherUser.id]);

    const { data: fetchedMessages, isLoading: isLoadingMessages, error: messagesError } = useCollection<ChatMessage>(messagesQuery);

    // Messages are now sorted on the client-side after being fetched.
    const messages = useMemo(() => {
        if (!fetchedMessages) return [];
        return [...fetchedMessages].sort((a, b) => {
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
            return dateA - dateB;
        });
    }, [fetchedMessages]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

     useEffect(() => {
        if (messages && messages.length > 0 && firestore && currentUser) {
            const batch = writeBatch(firestore);
            let updatesMade = false;

            messages.forEach(msg => {
                if (msg.id && msg.senderId === otherUser.id && !msg.isRead) {
                    const msgRef = doc(firestore, 'messages', msg.id);
                    batch.update(msgRef, { isRead: true });
                    updatesMade = true;
                }
            });

            if (updatesMade) {
                batch.commit().catch(err => {
                    console.error("Error marking messages as read:", err);
                    // Don't emit a global error for this, as it's a background task.
                });
            }
        }
    }, [messages, firestore, currentUser, otherUser.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
    
        setIsSending(true);
    
        const messageData = { // No ID needed for new doc
            senderId: currentUser.uid,
            content: newMessage.trim(),
            timestamp: serverTimestamp(),
            members: [currentUser.uid, otherUser.id].sort(),
            isRead: false,
        };
    
        const messagesColRef = collection(firestore, 'messages');
        
        addDoc(messagesColRef, messageData)
            .then(() => {
                setNewMessage('');
            })
            .catch(err => {
                const permissionError = new FirestorePermissionError({
                    path: messagesColRef.path,
                    operation: 'create',
                    requestResourceData: messageData,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <div className="flex flex-col h-[600px] bg-background/50 rounded-lg border border-border/50">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {isLoadingMessages && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                
                {messagesError && <div className="text-center text-red-400">Error loading messages. It might be a permission issue.</div>}

                {!isLoadingMessages && messages && messages.length === 0 && (
                    <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                        <p>No messages yet.</p>
                        <p>Start the conversation with {otherUser.name.split(' ')[0]}!</p>
                    </div>
                )}
                
                {messages?.map((msg, index) => {
                    const isCurrentUser = msg.senderId === currentUser.uid;
                    const senderName = isCurrentUser ? currentUser.displayName : otherUser.name;
                    const senderPhoto = isCurrentUser ? currentUser.photoURL : otherUser.photoURL;

                    return (
                        <div key={msg.id || index} className={cn('flex items-start gap-3', isCurrentUser && 'justify-end')}>
                            {!isCurrentUser && (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={senderPhoto || `https://api.dicebear.com/8.x/initials/svg?seed=${senderName}`} />
                                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className="flex flex-col max-w-xs md:max-w-md">
                                <div className={cn(
                                    'rounded-lg px-4 py-2 text-sm',
                                    isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                                )}>
                                    {msg.content}
                                </div>
                                <span className={cn(
                                    'text-xs text-muted-foreground mt-1',
                                     isCurrentUser ? 'text-right' : 'text-left'
                                )}>
                                    {msg.timestamp?.toDate ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </span>
                            </div>
                             {isCurrentUser && (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={senderPhoto || `https://api.dicebear.com/8.x/initials/svg?seed=${senderName}`} />
                                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border/50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                        disabled={isSending}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
