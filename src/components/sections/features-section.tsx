
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, GitPullRequest, MessageSquare, CalendarDays, Award, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Users,
    title: "Developer Profiles",
    description: "Showcase your tech stack, projects, and what you're eager to learn with our clean, tag-based profile system.",
  },
  {
    icon: GitPullRequest,
    title: "AI-Powered Matching",
    description: "Our intelligent algorithm analyzes your skills and learning goals to connect you with the perfect dev for a skill swap.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Seamlessly communicate, plan sessions, and share code snippets with our integrated, markdown-friendly chat.",
  },
  {
    icon: CalendarDays,
    title: "Availability Sync",
    description: "Our sleek calendar UI makes scheduling your swap sessions across timezones effortless.",
  },
  {
    icon: Award,
    title: "Gamified Reputation",
    description: "Earn Skill Points for successful swaps, climb the leaderboard, and unlock badges to certify your mastery.",
  },
  {
    icon: Share2,
    title: "Snippet Sharing",
    description: "Share project links or code snippets in chat, complete with rich, AI-generated previews and syntax highlighting.",
  },
];

export default function FeaturesSection() {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section id="features" className="py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold">Plug Into the Network</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A suite of powerful features designed to make your skill-swapping journey smooth, rewarding, and visually stunning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="show"
              variants={FADE_IN_ANIMATION_VARIANTS}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="cursor-target"
            >
              <Card className="bg-card/70 border-border/50 hover:border-accent/50 transition-all duration-300 hover:bg-card/90 group transform hover:-translate-y-2 hover:shadow-[0_0_25px_hsl(var(--accent)/0.3)] h-full">
                <CardHeader className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <CardTitle className="font-headline text-xl text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
