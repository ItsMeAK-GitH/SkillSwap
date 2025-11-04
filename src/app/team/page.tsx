
'use client';

import Header from '@/components/layout/header';
import ProfileCard from '@/components/ProfileCard';
import Image from 'next/image';
import ConnectingLines from '@/components/ConnectingLines';

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Meet the Architects of DevSwap
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              The developers who brought this skill-swapping platform to life.
            </p>
          </div>
          
          <div className="relative mt-16 mb-24 max-w-7xl mx-auto">
             <ConnectingLines
                numElements={teamMembers.length}
                sourceElementId="team-photo"
                elementClassName="profile-card-for-lines"
             />
            <div id="team-photo" className="max-w-xl mx-auto">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/30 bg-white">
                    <Image
                    src="/team/team.png"
                    alt="DevSwap Team Photo"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="grayscale"
                    unoptimized 
                    />
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                 <div key={member.name} className="profile-card-for-lines">
                    <ProfileCard
                      name={member.name}
                      title={member.title}
                      handle={member.handle}
                      status="Building"
                      contactText="GitHub"
                      avatarUrl={member.avatarUrl}
                      showUserInfo={false}
                      enableTilt={true}
                      onContactClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleContactClick(member.contactLink);
                      }}
                    />
                 </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
