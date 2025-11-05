
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'firebase/auth';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleDetails {
    type: 'schedule';
    proposerId: string;
    date: string; // ISO string
    title: string;
    meetLink: string;
    status: 'pending' | 'accepted';
}

interface ChatMessage {
    id?: string;
    senderId: string;
    content: string | ScheduleDetails;
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

function SchedulePopover({ onScheduleSend, currentUser, otherUser }: { onScheduleSend: (content: ScheduleDetails) => void; currentUser: User; otherUser: OtherUser; }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [hour, setHour] = useState<string>('12');
    const [minute, setMinute] = useState<string>('00');
    const [ampm, setAmpm] = useState<string>('PM');

    const generateMeetLink = () => {
        const randomString = () => Math.random().toString(36).substring(2, 5);
        return `https://meet.google.com/devswap-${randomString()}-${randomString()}`;
    };

    const handleScheduleSend = () => {
        if (!date) return;
        
        let hours = parseInt(hour, 10);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        date.setHours(hours);
        date.setMinutes(parseInt(minute, 10));

        const meetLink = generateMeetLink();
        
        const scheduleDetails: ScheduleDetails = {
            type: 'schedule',
            proposerId: currentUser.uid,
            title: `Skill Swap: ${currentUser.displayName} & ${otherUser.name}`,
            date: date.toISOString(),
            meetLink: meetLink,
            status: 'pending'
        };

        onScheduleSend(scheduleDetails);
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 / 5 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="sr-only">Schedule a meeting</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                <div className="space-y-4">
                    <h4 className="font-medium text-center">Schedule a Swap</h4>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="rounded-md border"
                    />
                    <div className="flex justify-center gap-2">
                        <Select value={hour} onValueChange={setHour}>
                            <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={minute} onValueChange={setMinute}>
                            <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={ampm} onValueChange={setAmpm}>
                            <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleScheduleSend} className="w-full">Schedule & Send</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

const isSchedule = (content: any): content is ScheduleDetails => {
  return typeof content === 'object' && content !== null && content.type === 'schedule';
};

const ScheduleCard = ({ msg, currentUser }: { msg: ChatMessage, currentUser: User }) => {
    const firestore = useFirestore();
    if (!isSchedule(msg.content)) return null;
    
    const details = msg.content;
    const isReceiver = currentUser.uid !== details.proposerId;

    const handleAccept = async () => {
        if (!msg.id || !firestore) return;
        const msgRef = doc(firestore, 'messages', msg.id);
        const newContent = { ...details, status: 'accepted' as const };
        try {
            await updateDoc(msgRef, { content: newContent });
        } catch (err) {
            const permissionError = new FirestorePermissionError({
                path: msgRef.path,
                operation: 'update',
                requestResourceData: { content: newContent },
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };
    
    const parsedDate = parseISO(details.date);

    return (
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50 max-w-sm">
            <h4 className="font-bold text-lg mb-2">{details.title}</h4>
            <div className="space-y-2 text-sm">
                <p><strong>When:</strong> {format(parsedDate, 'PPPP p')}</p>
                <a href={details.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                    <strong>Meet Link:</strong> {details.meetLink}
                </a>
            </div>
             {isReceiver && details.status === 'pending' && (
                <Button onClick={handleAccept} className="w-full mt-4">
                    <Check className="mr-2" /> Accept Request
                </Button>
            )}
            {details.status === 'accepted' && (
                <div className="mt-4 text-center text-sm font-semibold text-green-400 bg-green-500/10 py-2 rounded-md">
                    Meeting Confirmed
                </div>
            )}
        </div>
    );
};


export default function ChatInterface({ currentUser, otherUser }: ChatInterfaceProps) {
    const firestore = useFirestore();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const allMessagesQuery = useMemoFirebase(() => {
        if (!currentUser) return null;
        return query(
            collection(firestore, 'messages'),
            where('members', 'array-contains', currentUser.uid)
        );
    }, [firestore, currentUser]);

    const { data: fetchedMessages, isLoading: isLoadingMessages, error: messagesError } = useCollection<ChatMessage>(allMessagesQuery);
    
    const messages = useMemo(() => {
        if (!fetchedMessages) return [];
        return fetchedMessages
            .filter(msg => msg.members.includes(otherUser.id))
            .sort((a, b) => {
                const dateA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
                const dateB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
                return dateA - dateB;
            });
    }, [fetchedMessages, otherUser.id]);
    
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
                });
            }
        }
    }, [messages, firestore, currentUser, otherUser.id]);

    const sendMessage = async (content: string | ScheduleDetails) => {
        if (typeof content === 'string' && !content.trim()) return;
        if (!currentUser) return;

        setIsSending(true);

        const messageData = {
            senderId: currentUser.uid,
            content: typeof content === 'string' ? content.trim() : content,
            timestamp: serverTimestamp(),
            members: [currentUser.uid, otherUser.id].sort(),
            isRead: false,
        };

        const messagesColRef = collection(firestore, 'messages');
        
        try {
            await addDoc(messagesColRef, messageData);
            setNewMessage('');
        } catch (err) {
            const permissionError = new FirestorePermissionError({
                path: messagesColRef.path,
                operation: 'create',
                requestResourceData: messageData,
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsSending(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(newMessage);
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

                    // This is the definitive fix. We determine what to render *before* the return statement.
                    let contentToRender;
                    if (isSchedule(msg.content)) {
                        contentToRender = <ScheduleCard msg={msg} currentUser={currentUser} />;
                    } else if (typeof msg.content === 'string') {
                        contentToRender = (
                            <div className={cn(
                                'rounded-lg px-4 py-2 text-sm',
                                isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                            )}>
                                {msg.content}
                            </div>
                        );
                    } else {
                        // If it's not a schedule or a string (e.g., an invalid or temporary state), render nothing.
                        contentToRender = null;
                    }

                    return (
                        <div key={msg.id || index} className={cn('flex items-start gap-3', isCurrentUser && 'justify-end')}>
                            {!isCurrentUser && (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={senderPhoto || `https://api.dicebear.com/8.x/initials/svg?seed=${senderName}`} />
                                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className="flex flex-col max-w-xs md:max-w-md">
                                {contentToRender}
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
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <SchedulePopover onScheduleSend={sendMessage} currentUser={currentUser} otherUser={otherUser} />
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
