
'use client';

const recommendedSkills = [
  { name: 'TypeScript', reason: 'Increased type safety' },
  { name: 'GraphQL', reason: 'More efficient data fetching' },
  { name: 'Docker', reason: 'Containerization and deployment' },
  { name: 'Kubernetes', reason: 'Orchestration of containers' },
];

export default function RecommendedSkills() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Recommended Skills
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Learn these skills to improve your job prospects.
          </p>
        </div>
        <div className="mt-10">
          <div className="max-w-2xl mx-auto">
            <ul className="divide-y divide-border">
              {recommendedSkills.map((skill) => (
                <li key={skill.name} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{skill.name}</h3>
                      <p className="text-muted-foreground">{skill.reason}</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Learn More
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
