
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GitPullRequest, User, LogOut, LayoutDashboard, Users, MessageSquare } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { collection, query, where } from 'firebase/firestore';

interface ChatMessage {
  isRead: boolean;
  senderId: string;
  members: string[];
}

export default function Header() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const unreadMessagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'messages'),
      where('members', 'array-contains', user.uid)
    );
  }, [user, firestore]);

  const { data: messages } = useCollection<ChatMessage>(unreadMessagesQuery);
  const unreadCount = messages?.filter(msg => !msg.isRead && msg.senderId !== user?.uid).length || 0;


  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  const navLinks = [
    { href: "/jobs", label: "Find a Swap" },
    { href: "/community", label: "Community" },
  ];

  const isLinkActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4">
      <div className="container mx-4 sm:mx-6 lg:mx-8 flex items-center justify-between h-16 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2 text-xl font-headline font-bold cursor-target">
            <GitPullRequest className="w-7 h-7 text-primary transition-all duration-300 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
              devswap<sup className="text-xs font-medium ml-1 opacity-70">v1</sup>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'cursor-target text-sm font-medium transition-colors hover:text-primary',
                  isLinkActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {isUserLoading ? (
            <div className="w-10 h-10 animate-pulse bg-muted rounded-full" />
          ) : (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative cursor-target">
                       <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-background" />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-target">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/chat')} className="cursor-target">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Chats</span>
                       {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="md:hidden"/>
                    <DropdownMenuItem onClick={() => router.push('/jobs')} className="cursor-target md:hidden">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Find a Swap</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/community')} className="cursor-target md:hidden">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Community</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-target">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.7)] transition-shadow duration-300"
                >
                  Sign In
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
