import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type SkillOrbProps = {
  name: string;
  icon: LucideIcon;
  description: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function SkillOrb({ name, icon: Icon, description, className, style }: SkillOrbProps) {
  return (
    <div className={cn("group relative", className)} style={style}>
      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-card/60 backdrop-blur-sm border border-border/30 flex flex-col items-center justify-center text-center p-4 transition-all duration-500 group-hover:scale-110 group-hover:border-primary cursor-pointer">
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2 transition-all duration-500 group-hover:text-accent group-hover:drop-shadow-[0_0_10px_hsl(var(--accent))]" />
        <h3 className="font-headline text-sm md:text-base font-medium text-foreground">{name}</h3>
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 filter blur-2xl transition-all duration-500 opacity-70 group-hover:bg-accent/30 group-hover:scale-125"></div>
      
      {/* Expanded view on hover */}
      <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-4 rounded-lg bg-card border border-border shadow-lg opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:mt-2 group-hover:delay-200">
        <h4 className="font-headline font-bold text-lg mb-2 text-accent">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
