import Link from 'next/link';
import { Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Share2 className="w-6 h-6 text-primary" />
          <p className="text-lg font-headline font-bold text-foreground">SkillSynapse</p>
        </div>
        <p>&copy; 2024 SkillSynapse. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
