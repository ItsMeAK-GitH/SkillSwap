
"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TextType from '@/components/TextType';
import LogoLoop from '../LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiVercel, SiFirebase, SiGooglecloud } from 'react-icons/si';
import { useUser } from '@/firebase/auth/use-user';

const techLogos = [
  { node: <SiReact size={32} />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs size={32} />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript size={32} />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss size={32} />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiVercel size={32} />, title: "Vercel", href: "https://vercel.com" },
  { node: <SiFirebase size={32} />, title: "Firebase", href: "https://firebase.google.com" },
  { node: <SiGooglecloud size={32} />, title: "Google Cloud", href: "https://cloud.google.com" },
];

const skills = [
  { name: 'Next.js', href: 'https://nextjs.org/' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org/' },
  { name: 'Go', href: 'https://go.dev/' },
  { name: 'Rust', href: 'https://www.rust-lang.org/' },
  { name: 'GraphQL', href: 'https://graphql.org/' },
  { name: 'Docker', href: 'https://www.docker.com/' },
  { name: 'Kubernetes', href: 'https://kubernetes.io/' },
  { name: 'Solidity', href: 'https://soliditylang.org/' },
  { name: 'Web Assembly', href: 'https://webassembly.org/' },
  { name: 'Figma', href: 'https://www.figma.com/' },
  { name: 'TensorFlow', href: 'https://www.tensorflow.org/' },
  { name: 'PyTorch', href: 'https://pytorch.org/' },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const findSwapHref = user ? "/jobs" : "/login";
  const listSkillsHref = user ? "/profile" : "/login";

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
          <TextType 
            as="span"
            text={["Swap Code,", "Share Knowledge,", "Level Up,"]}
            typingSpeed={75}
            deletingSpeed={40}
            pauseDuration={2000}
            className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
            cursorClassName="text-accent"
          />
          <br />
          Master New Tech.
        </motion.h1>
        <motion.p 
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 font-headline"
        >
          Connect with a global network of developers to trade knowledge, level up your stack, and build the future, together.
        </motion.p>
        <motion.div 
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={findSwapHref} passHref>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary))] hover:shadow-[0_0_30px_hsl(var(--primary))] transition-all duration-300 transform hover:scale-105">
              Find a Swap <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href={listSkillsHref} passHref>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-[0_0_15px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_25px_hsl(var(--accent)/0.5)] transition-all duration-300 transform hover:scale-105">
              List Your Skills
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="my-20 text-muted-foreground">
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="left"
          logoHeight={32}
          gap={60}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="hsl(var(--background))"
          ariaLabel="Technology partners"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Skill Nebula */}
        <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="relative max-w-4xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-4">Trending Tech</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {skills.map((skill, i) => (
              <Link key={skill.name} href={skill.href} target="_blank" rel="noopener noreferrer">
                <Badge
                  variant="outline"
                  className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2 border-border/50 text-foreground/80 bg-card/50 transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] cursor-target"
                  style={{ animation: `float 8s ease-in-out infinite ${i * 0.5}s` }}
                >
                  {skill.name}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
