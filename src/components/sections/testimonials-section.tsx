
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    quote: "SkillSynapse completely changed how I learn. I picked up Python in a month by teaching someone guitar. It's genius!",
    name: "Sanjeev TS",
    title: "Skater & Aspiring Developer",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-1')
  },
  {
    quote: "The interface is just... beautiful. It feels like a futuristic learning hub. I got matched with a UX designer who helped me redesign my portfolio.",
    name: "Akhilan VTM",
    title: "Graphic Designer",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-2')
  },
  {
    quote: "As a freelance photographer, I wanted to learn video editing. I found someone to swap skills with in two days. The platform is incredibly efficient and fun to use.",
    name: "Akshith Rajesh",
    title: "Photographer & Videographer",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-3')
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold">From the Community</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Hear what our users have to say about their SkillSynapse experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-card/70 border-border/50 flex flex-col transform hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_25px_hsl(var(--primary)/0.2)]">
              <CardContent className="p-8 flex-1 flex flex-col">
                <blockquote className="text-lg text-foreground/90 flex-1">"{testimonial.quote}"</blockquote>
                <div className="mt-6 flex items-center">
                  {testimonial.image && (
                    <Image
                      src={testimonial.image.imageUrl}
                      alt={`Photo of ${testimonial.name}`}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-primary/50"
                      data-ai-hint={testimonial.image.imageHint}
                    />
                  )}
                  <div className="ml-4">
                    <p className="font-semibold font-headline text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
