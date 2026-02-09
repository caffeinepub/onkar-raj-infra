import { SiCaffeine } from 'react-icons/si';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <img
              src="/assets/generated/onkar-raj-infra-logo.dim_512x512.png"
              alt="Onkar Raj Infra"
              className="h-12 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              Premium quality HDPE pipes for industrial, agricultural, and infrastructure applications.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-primary transition-colors">Products</a></li>
              <li><a href="/advantages" className="hover:text-primary transition-colors">Advantages</a></li>
              <li><a href="/uses" className="hover:text-primary transition-colors">Applications</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Onkar Raj Infra</li>
              <li>HDPE Pipes: 20mm - 180mm</li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Get in Touch</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <SiCaffeine className="h-4 w-4 text-primary" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
