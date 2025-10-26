"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const skills = [
  'Python', 'Guitar', 'Video Editing', 'UX Design', 'React', 'Digital Marketing',
  'Cooking', 'Photography', 'Spanish', 'Yoga', 'Machine Learning', 'Creative Writing'
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Background glowing shapes */}
      <div className="absolute inset-0 -z-10">
        <div ref={glowRef} className="absolute w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-0 -left-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-40 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -top-24 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-40 animate-blob" style={{animationDelay: '4s'}}></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-40 animate-blob" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6"
        >
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            Synapse Your Skills.
          </span>
          <br />
          Master New Arts.
        </motion.h1>
        <motion.p 
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
        >
          Connect with a global community to swap skills, gain knowledge, and unlock your full potential. Learn what you desire, teach what you master.
        </motion.p>
        <motion.div 
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/jobs" passHref>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary))] hover:shadow-[0_0_30px_hsl(var(--primary))] transition-all duration-300 transform hover:scale-105">
              Find Your Skill Swap <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/jobs" passHref>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-[0_0_15px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_25px_hsl(var(--accent)/0.5)] transition-all duration-300 transform hover:scale-105">
              List Your Skills
            </Button>
          </Link>
        </motion.div>

        {/* Skill Nebula */}
        <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="relative max-w-4xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-4">Trending Skills</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {skills.map((skill, i) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2 border-border/50 text-foreground/80 bg-card/50 transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
                style={{ animation: `float 8s ease-in-out infinite ${i * 0.5}s` }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
