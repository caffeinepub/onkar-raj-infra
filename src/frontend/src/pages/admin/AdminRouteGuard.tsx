import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { adminSession } from '../../utils/adminSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUnlocked, setIsUnlocked] = useState(adminSession.isUnlocked());
  const [hasRedirected, setHasRedirected] = useState(false);

  // Subscribe to session changes
  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setIsUnlocked(adminSession.isUnlocked());
    });
    return unsubscribe;
  }, []);

  // Redirect to admin login if not unlocked
  useEffect(() => {
    if (!isUnlocked && !hasRedirected) {
      setHasRedirected(true);
      navigate({ 
        to: '/admin/login',
        search: { returnPath: location.pathname },
        replace: true,
      });
    }
  }, [isUnlocked, navigate, location.pathname, hasRedirected]);

  // Reset redirect flag when unlocked
  useEffect(() => {
    if (isUnlocked) {
      setHasRedirected(false);
    }
  }, [isUnlocked]);

  // If session is unlocked, render admin content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (redirect will happen)
  return null;
}
