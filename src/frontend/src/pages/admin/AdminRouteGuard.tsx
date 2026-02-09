import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useVerifyAdminPasskey } from '../../hooks/useAuthz';
import AdminTwoStepAccessPrompt from './AdminTwoStepAccessPrompt';
import { adminSession } from '../../utils/adminSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyMutation = useVerifyAdminPasskey();
  const [isUnlocked, setIsUnlocked] = useState(adminSession.isUnlocked());

  // Subscribe to session changes
  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setIsUnlocked(adminSession.isUnlocked());
    });
    return unsubscribe;
  }, []);

  const handleVerify = async (passkey: string) => {
    try {
      await verifyMutation.mutateAsync(passkey);
      // Successfully verified, update state
      setIsUnlocked(true);
      
      // Navigate to the originally requested path, or default to /admin/products if on /admin
      if (location.pathname === '/admin') {
        navigate({ to: '/admin/products' });
      }
      // Otherwise stay on the current path (it will now render)
    } catch (error: any) {
      // Re-throw to let the prompt component handle the error display
      throw error;
    }
  };

  // If session is unlocked, render admin content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Otherwise, show passkey prompt (no admin content should be visible)
  return (
    <AdminTwoStepAccessPrompt
      onVerify={handleVerify}
      isVerifying={verifyMutation.isPending}
    />
  );
}
