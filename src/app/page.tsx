import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import SkillShowcaseSection from '@/components/sections/skill-showcase-section';
import FeaturesSection from '@/components/sections/features-section';
import TestimonialsSection from '@/components/sections/testimonials-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SkillShowcaseSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
