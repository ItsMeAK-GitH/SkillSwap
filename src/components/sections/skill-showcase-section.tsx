
"use client";

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import SkillOrb from '@/components/skill-orb';
import { Code, Server, Cloud, Cpu, Search, Palette } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const allSkills = [
  { name: 'Frontend Dev', icon: Palette, description: 'Teach or learn React, Vue, Svelte, and modern CSS.' },
  { name: 'Backend Dev', icon: Server, description: 'Master Node.js, Python, Go, or Rust for server-side logic.' },
  { name: 'DevOps', icon: Cloud, description: 'Swap skills in Docker, Kubernetes, CI/CD, and cloud infrastructure.' },
  { name: 'AI / ML', icon: Cpu, description: 'Dive into TensorFlow, PyTorch, and the world of machine learning.' },
  { name: 'Smart Contracts', icon: Code, description: 'Learn Solidity or Rust to build on the decentralized web.' },
  { name: 'UI/UX Design', icon: Palette, description: 'Master Figma, design systems, and user-centered principles.' },
];

export default function SkillShowcaseSection() {
  const [search, setSearch] = useState('');
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 80%", "end end"],
  });

  const skillsWithDuplicates = [...allSkills, ...allSkills, ...allSkills, ...allSkills];

  // Adjust the transform to create a seamless loop
  // We use -25% because we have duplicated the content 4 times. The animation needs to move a quarter of the total width to complete one full loop.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredSkillsWithDuplicates = [...filteredSkills, ...filteredSkills, ...filteredSkills, ...filteredSkills];


  return (
    <section id="showcase" ref={targetRef} className="relative py-20 md:py-32 border-y border-border/30 bg-transparent h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold">Explore the Skill Spectrum</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Scroll through to discover the skills being swapped on DevSwap, or search for something specific.
          </p>
        </div>
        
        <div className="max-w-md mx-auto mb-16 w-full px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 h-12 text-lg bg-card/50 border-border/50 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-12 pointer-events-none">
            {(search ? filteredSkillsWithDuplicates : skillsWithDuplicates).map((skill, i) => (
                <div key={`${skill.name}-${i}`} className="flex-shrink-0 pointer-events-auto">
                    <SkillOrb
                        name={skill.name}
                        icon={skill.icon}
                        description={skill.description}
                        style={{ animation: `float 8s ease-in-out infinite ${i * 0.6}s` }}
                    />
                </div>
            ))}
        </motion.div>
        
        {search && filteredSkills.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No skills found. Try a different search!</p>
        )}
      </div>
    </section>
  );
}
