'use client';

import Header from '@/components/layout/header';
import ProfileCard from '@/components/ProfileCard';

const teamMembers = [
  {
    name: 'Akshith Rajesh',
    title: 'Full-Stack & AI Architect',
    handle: 'ItsMeAK-GitH',
    avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Akshith',
    contactLink: 'https://github.com/ItsMeAK-GitH'
  },
  {
    name: 'Akhilan VTM',
    title: 'Frontend & UI/UX Specialist',
    handle: 'akhilanvtm',
    avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Akhilan',
    contactLink: 'https://github.com/akhilanvtm'
  },
  {
    name: 'Sanjeev TS',
    title: 'Backend & DevOps Engineer',
    handle: 'sanjeev-ts',
    avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sanjeev',
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
        </div>
      </main>
    </div>
  );
}
