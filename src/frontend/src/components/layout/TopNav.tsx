import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/advantages', label: 'Advantages' },
    { path: '/uses', label: 'Applications' },
    { path: '/order', label: 'Order' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/assets/generated/onkar-raj-infra-logo.dim_512x512.png"
            alt="Onkar Raj Infra"
            className="h-10 w-auto"
          />
          <span className="hidden font-display text-lg font-semibold sm:inline-block">
            Onkar Raj Infra
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === link.path || (link.path === '/admin' && currentPath.startsWith('/admin'))
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LoginButton />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent ${
                  currentPath === link.path || (link.path === '/admin' && currentPath.startsWith('/admin'))
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
