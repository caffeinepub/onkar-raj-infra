import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Droplets, Factory, Waves, Drill, Flame, Building2 } from 'lucide-react';

export default function UsesApplicationsPage() {
  useEffect(() => {
    document.title = 'Applications - Onkar Raj Infra HDPE Pipes';
  }, []);

  const applications = [
    {
      icon: Sprout,
      title: 'Agricultural Irrigation Systems',
      description: 'Efficient water distribution for farms and agricultural lands',
    },
    {
      icon: Droplets,
      title: 'Water Supply Pipelines',
      description: 'Reliable municipal and residential water distribution',
    },
    {
      icon: Factory,
      title: 'Industrial Fluid Transport',
      description: 'Safe conveyance of chemicals and industrial fluids',
    },
    {
      icon: Waves,
      title: 'Sewage and Drainage Systems',
      description: 'Effective wastewater management and drainage solutions',
    },
    {
      icon: Drill,
      title: 'Borewell and Plumbing Applications',
      description: 'Durable pipes for borewell casing and plumbing systems',
    },
    {
      icon: Flame,
      title: 'Gas Distribution',
      description: 'Safe and reliable gas pipeline networks (where applicable)',
    },
    {
      icon: Building2,
      title: 'Infrastructure and Construction Projects',
      description: 'Essential piping for large-scale infrastructure development',
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Uses & Applications</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our HDPE pipes serve a wide range of industries and applications, providing reliable solutions for diverse needs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application, index) => {
            const Icon = application.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-industrial">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{application.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{application.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
