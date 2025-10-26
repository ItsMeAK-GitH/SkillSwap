
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import SkillOrb from '@/components/skill-orb';
import { Code, Music, Palette, Camera, Mic, Cpu, Search } from 'lucide-react';

const allSkills = [
  { name: 'Python', icon: Code, description: 'Teach or learn Python for data science, web dev, and more.' },
  { name: 'Guitar', icon: Music, description: 'From beginner chords to advanced solos, find your jam partner.' },
  { name: 'UI/UX Design', icon: Palette, description: 'Master Figma, Adobe XD, and the principles of great design.' },
  { name: 'Photography', icon: Camera, description: 'Learn composition, lighting, and editing to capture stunning photos.' },
  { name: 'Public Speaking', icon: Mic, description: 'Gain confidence and captivate any audience.' },
  { name: 'AI/ML', icon: Cpu, description: 'Dive into the world of artificial intelligence and machine learning.' },
];

export default function SkillShowcaseSection() {
  const [search, setSearch] = useState('');

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="showcase" className="py-20 md:py-32 border-y border-border/30 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold">Explore the Skill Nebula</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hover over a skill to see more, or search for something specific. Your next passion is just a click away.
          </p>
        </div>
        
        <div className="max-w-md mx-auto mb-16">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-24 justify-items-center">
          {filteredSkills.map((skill, i) => (
            <SkillOrb
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              description={skill.description}
              style={{ animation: `float 8s ease-in-out infinite ${i * 0.6}s` }}
            />
          ))}
        </div>
        {filteredSkills.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No skills found. Try a different search!</p>
        )}
      </div>
    </section>
  );
}
