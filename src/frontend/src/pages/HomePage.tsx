import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Onkar Raj Infra - Premium HDPE Pipes Manufacturer';
  }, []);

  const features = [
    'High-quality HDPE pipes',
    'Diameter range: 20mm - 180mm',
    'Certified & reliable',
    'Fast delivery',
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32"
        style={{
          backgroundImage: 'url(/assets/generated/hdpe-hero-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
              Premium Quality HDPE Pipes by Onkar Raj Infra
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              We manufacture high-quality High Density Poly Ethene (HDPE) pipes, supplying durable and reliable piping solutions for industrial, agricultural, and infrastructure applications.
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/products' })} className="gap-2">
                View Products
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/order' })}>
                Order Now
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate({ to: '/contact' })}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">About Onkar Raj Infra</h2>
            <p className="text-lg text-muted-foreground">
              Onkar Raj Infra is a trusted manufacturer of high-quality HDPE pipes, offering a comprehensive range from 20mm to 180mm in diameter. Our pipes are designed to meet the highest standards of durability, reliability, and performance for various applications including water supply, irrigation, industrial fluid transport, and infrastructure projects.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to Get Started?</h2>
            <p className="mb-6 text-muted-foreground">
              Explore our product range or get in touch with us for custom requirements.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/products' })}>
                Browse Products
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/contact' })}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
