
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { signOut } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-2 text-2xl font-headline font-bold">
            <Share2 className="w-8 h-8 text-primary transition-all duration-300 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
              SkillSwap
            </h1>
          </Link>
          <nav className="flex items-center gap-4">
            {isUserLoading ? (
              <div className="w-24 h-8 animate-pulse bg-muted rounded-md" />
            ) : (
              <>
                {user ? (
                  <>
                    <span className="text-muted-foreground hidden sm:inline">Welcome, {user.displayName}</span>
                    <Link href="/profile" passHref>
                      <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <Button variant="ghost" onClick={signOut}>Sign Out</Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => router.push('/login')}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_15px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_25px_hsl(var(--accent)/0.7)] transition-shadow duration-300"
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
