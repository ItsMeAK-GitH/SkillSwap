import ScrollStack, { ScrollStackItem } from '../ScrollStack';

const testimonials = [
  {
    quote: "I taught a junior dev how to use Docker and in return, they showed me some advanced React patterns I'd never seen. DevSwap is a game-changer.",
    name: "Sanjeev TS",
    title: "Senior DevOps Engineer",
  },
  {
    quote: "The UI is incredible. I got matched with a designer who helped me with my portfolio, and I taught them how to build a Next.js blog. Win-win.",
    name: "Akhilan VTM",
    title: "Frontend Developer",
  },
  {
    quote: "I wanted to get into Web3. I found a Solidity expert who was looking to learn Python for data analysis. We swapped skills for a month. Incredibly efficient.",
    name: "Akshith Rajesh",
    title: "Data Scientist",
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold">From the Community</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Hear what our developers have to say about their DevSwap experience.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <ScrollStack useWindowScroll={true} itemDistance={20} itemStackDistance={20} rotationAmount={2}>
          {testimonials.map((testimonial) => (
            <ScrollStackItem key={testimonial.name}>
              <div className="flex flex-col h-full">
                <blockquote className="text-xl md:text-2xl text-foreground/90 flex-1">"{testimonial.quote}"</blockquote>
                <div className="mt-6 flex items-center">
                  <div className="ml-4">
                    <p className="font-semibold font-headline text-lg text-foreground">{testimonial.name}</p>
                    <p className="text-md text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
