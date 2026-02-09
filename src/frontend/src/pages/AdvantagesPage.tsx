import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Droplet, Lock, Feather, Zap, Wrench, Layers, Leaf } from 'lucide-react';

export default function AdvantagesPage() {
  useEffect(() => {
    document.title = 'Advantages - Onkar Raj Infra HDPE Pipes';
  }, []);

  const advantages = [
    {
      icon: Shield,
      title: 'High Durability and Long Life',
      description: 'Built to last for decades with minimal degradation',
    },
    {
      icon: Droplet,
      title: 'Corrosion and Chemical Resistant',
      description: 'Withstands harsh chemicals and corrosive environments',
    },
    {
      icon: Lock,
      title: 'Leak-Proof Joints',
      description: 'Secure connections that prevent water loss',
    },
    {
      icon: Feather,
      title: 'Lightweight and Easy to Install',
      description: 'Reduces installation time and labor costs',
    },
    {
      icon: Zap,
      title: 'High Flexibility and Impact Resistance',
      description: 'Adapts to ground movement and resists damage',
    },
    {
      icon: Wrench,
      title: 'Low Maintenance Cost',
      description: 'Minimal upkeep required over the product lifetime',
    },
    {
      icon: Layers,
      title: 'Suitable for Underground and Above-Ground Use',
      description: 'Versatile installation options for any project',
    },
    {
      icon: Leaf,
      title: 'Environment-Friendly and Recyclable',
      description: 'Sustainable choice that reduces environmental impact',
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Advantages of HDPE Pipes</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover why HDPE pipes are the preferred choice for modern infrastructure, industrial, and agricultural applications.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-industrial">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{advantage.title}</h3>
                  <p className="text-sm text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
