
import Link from 'next/link';
import { GitPullRequest, Users } from 'lucide-react';
import CurvedLoop from '../CurvedLoop';

export default function Footer() {
  const commitHash = '0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'.substring(0, 12);
  const contributors = ['Akshith', 'Akhilan', 'Sanjeev'];

  return (
    <footer className="border-t border-border/20 py-8 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        
        <div className="my-8">
            <CurvedLoop 
                marqueeText="Made with ❤️ and lots of ☕ ✦"
                speed={1}
                curveAmount={80}
                direction="left"
                interactive={true}
                className="footer-curved-text"
            />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <GitPullRequest className="w-6 h-6 text-primary" />
          <p className="text-lg font-headline font-bold text-foreground">devswap.v1</p>
        </div>
        
        <div className="font-mono text-left bg-muted/20 p-4 rounded-lg max-w-md mx-auto text-sm border border-border/50 my-8">
          <p className="text-yellow-300">commit <span className="text-yellow-500">{commitHash}</span></p>
          <p className="whitespace-nowrap"><span className="text-gray-400">Author:</span> DevSwap Team &lt;<span className="text-cyan-400">{'{akshith, akhilan, sanjeev}'}</span>&gt;</p>
          <br/>
          <p className="pl-4">feat: Initial commit - launch devswap.v1</p>
        </div>

        <p className="text-sm">&copy; 2025 DevSwap. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <Link href="#" className="hover:text-primary transition-colors cursor-target">Privacy Policy</Link>
          <span className="opacity-50">|</span>
          <Link href="/team" className="hover:text-primary transition-colors cursor-target flex items-center gap-1">
            <Users className="w-3 h-3" /> Meet the Team
          </Link>
          <span className="opacity-50">|</span>
          <Link href="#" className="hover:text-primary transition-colors cursor-target">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
