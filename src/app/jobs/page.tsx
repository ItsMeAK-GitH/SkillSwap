
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import RecommendedSkills from '@/components/sections/recommended-skills';
import { Badge } from '@/components/ui/badge';

const jobs = [
  { title: 'Frontend Developer', company: 'Google', location: 'Mountain View, CA', skills: ['JavaScript', 'React', 'Node.js'] },
  { title: 'Backend Developer', company: 'Facebook', location: 'Menlo Park, CA', skills: ['Python', 'Django', 'SQL'] },
  { title: 'Full Stack Developer', company: 'Netflix', location: 'Los Gatos, CA', skills: ['JavaScript', 'React', 'Node.js', 'Python'] },
  { title: 'Data Scientist', company: 'Amazon', location: 'Seattle, WA', skills: ['Python', 'R', 'SQL'] },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.skills.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Find Your Dream Job
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              Search for jobs based on your skills.
            </p>
          </div>
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Search by skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-10">
            <ul className="divide-y divide-border">
              {filteredJobs.map((job) => (
                <li key={job.title} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company} - {job.location}</p>
                    </div>
                    <div className="flex gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RecommendedSkills />
      </main>
      <Footer />
    </div>
  );
}
