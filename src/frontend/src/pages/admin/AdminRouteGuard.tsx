import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { adminSession } from '../../utils/adminSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const [isUnlocked, setIsUnlocked] = useState(adminSession.isUnlocked());

  // Subscribe to session changes
  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setIsUnlocked(adminSession.isUnlocked());
    });
    return unsubscribe;
  }, []);

  // Redirect to admin login if not authenticated or not unlocked
  useEffect(() => {
    if (!identity || !isUnlocked) {
      navigate({ 
        to: '/admin/login',
        search: { returnPath: location.pathname }
      });
    }
  }, [identity, isUnlocked, navigate, location.pathname]);

  // If session is unlocked AND user is authenticated, render admin content
  if (isUnlocked && identity) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (redirect will happen)
  return null;
}
