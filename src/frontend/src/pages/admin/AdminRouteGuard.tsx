import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin, useVerifyAdminPasskey } from '../../hooks/useAuthz';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import LoginButton from '../../components/auth/LoginButton';
import AdminTwoStepAccessPrompt from './AdminTwoStepAccessPrompt';
import { adminSession } from '../../utils/adminSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, refetch } = useIsCallerAdmin();
  const verifyMutation = useVerifyAdminPasskey();
  const [showPrompt, setShowPrompt] = useState(false);

  const isAuthenticated = !!identity;

  // Clear session storage when identity becomes null (logout)
  useEffect(() => {
    if (!isAuthenticated) {
      adminSession.clear();
      setShowPrompt(false);
    }
  }, [isAuthenticated]);

  // Show prompt when authenticated but not admin and not session-unlocked
  useEffect(() => {
    if (isAuthenticated && !isCheckingAdmin && isAdmin === false && !adminSession.isUnlocked()) {
      setShowPrompt(true);
    } else if (isAuthenticated && !isCheckingAdmin && isAdmin === true) {
      setShowPrompt(false);
    }
  }, [isAuthenticated, isCheckingAdmin, isAdmin]);

  const handleVerify = async (passkey: string) => {
    try {
      await verifyMutation.mutateAsync(passkey);
      // Wait for admin status to refresh
      const result = await refetch();
      
      if (result.data === true) {
        // Successfully verified, close prompt and navigate to default admin page
        setShowPrompt(false);
        adminSession.setUnlocked();
        navigate({ to: '/admin/products' });
      } else {
        // Verification succeeded but admin status not updated - throw error
        throw new Error('Verification succeeded but admin status not confirmed. Please try again.');
      }
    } catch (error: any) {
      // Re-throw to let the prompt component handle the error display
      throw error;
    }
  };

  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Alert className="mx-auto max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>You must be logged in to access the admin dashboard.</p>
            <LoginButton />
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showPrompt && !isAdmin) {
    return (
      <AdminTwoStepAccessPrompt
        onVerify={handleVerify}
        isVerifying={verifyMutation.isPending}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="mx-auto max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
