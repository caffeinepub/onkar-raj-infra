import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { adminSession } from '../../utils/adminSession';
import { adminReturnPath } from '../../utils/adminReturnPath';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUnlocked, setIsUnlocked] = useState(adminSession.isUnlocked());
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Subscribe to session changes
  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      const newUnlockState = adminSession.isUnlocked();
      setIsUnlocked(newUnlockState);
      
      // Reset redirecting flag when unlocked
      if (newUnlockState) {
        setIsRedirecting(false);
      }
    });
    return unsubscribe;
  }, []);

  // Redirect to admin login if not unlocked (only once per lock state)
  useEffect(() => {
    if (!isUnlocked && !isRedirecting) {
      setIsRedirecting(true);
      
      // Persist the return path in sessionStorage before redirecting
      const currentPath = location.pathname;
      adminReturnPath.set(currentPath);
      
      navigate({ 
        to: '/admin/login',
        search: { returnPath: currentPath },
        replace: true,
      });
    }
  }, [isUnlocked, navigate, location.pathname, isRedirecting]);

  // If session is unlocked, render admin content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (redirect will happen)
  return null;
}
