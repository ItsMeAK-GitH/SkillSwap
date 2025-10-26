
'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const skills = [
  { name: 'JavaScript', demand: 'High' },
  { name: 'React', demand: 'High' },
  { name: 'Node.js', demand: 'Medium' },
  { name: 'Python', demand: 'High' },
  { name: 'SQL', demand: 'Medium' },
];

export default function MySkillsSection() {
  return (
    <section className="py-12 md:py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            My Skills
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Here are your skills and their current demand in the job market.
          </p>
        </div>
        <div className="mt-10">
          <div className="max-w-2xl mx-auto">
            <ul className="divide-y divide-border">
              {skills.map((skill) => (
                <li key={skill.name} className="py-4 flex items-center justify-between">
                  <span className="text-lg font-medium">{skill.name}</span>
                  <Badge variant={skill.demand === 'High' ? 'default' : 'secondary'}>
                    {skill.demand}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link href="/jobs">
            <Button size="lg">Find Jobs</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
