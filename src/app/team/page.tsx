
'use client';

import Header from '@/components/layout/header';
import ProfileCard from '@/components/ProfileCard';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Akshith Rajesh',
    title: 'Full-Stack & AI Architect',
    handle: 'ItsMeAK-GitH',
    avatarUrl: '/team/akshith.png',
    contactLink: 'https://github.com/ItsMeAK-GitH'
  },
  {
    name: 'Akhilan VTM',
    title: 'Frontend & UI/UX Specialist',
    handle: 'akhilanvtm',
    avatarUrl: '/team/akhilan.png',
    contactLink: 'https://github.com/akhilanvtm'
  },
  {
    name: 'Sanjeev TS',
    title: 'Backend & DevOps Engineer',
    handle: 'sanjeev-ts',
    avatarUrl: '/team/sanjeev.png',
    contactLink: 'https://github.com/sanjeev-ts'
  },
];

export default function TeamPage() {
  
  const handleContactClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Meet the Architects of DevSwap
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              The developers who brought this skill-swapping platform to life.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {teamMembers.map((member) => (
                 <ProfileCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    handle={member.handle}
                    status="Building"
                    contactText="GitHub"
                    avatarUrl={member.avatarUrl}
                    showUserInfo={true}
                    enableTilt={true}
                    onContactClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleContactClick(member.contactLink);
                    }}
                  />
              ))}
            </div>
          </div>

          <div className="mt-24">
            <div className="max-w-5xl mx-auto">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/30">
                <Image
                  src="/team/team.png"
                  alt="DevSwap Team Photo"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized // Use this if the image is already optimized or you want to avoid Next.js processing
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
