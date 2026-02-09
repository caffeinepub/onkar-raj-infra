import { useNavigate, useSearch } from '@tanstack/react-router';
import { useVerifyAdminPasskey } from '../../hooks/useAuthz';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AdminTwoStepAccessPrompt from './AdminTwoStepAccessPrompt';
import { useEffect } from 'react';
import { adminSession } from '../../utils/adminSession';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/admin/login' }) as { returnPath?: string };
  const verifyMutation = useVerifyAdminPasskey();
  const { identity, login, loginStatus } = useInternetIdentity();

  // If already unlocked and authenticated, redirect to admin
  useEffect(() => {
    if (adminSession.isUnlocked() && identity) {
      const returnPath = search.returnPath || '/admin/products';
      navigate({ to: returnPath as any });
    }
  }, [identity, navigate, search.returnPath]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please try again.');
    }
  };

  const handleVerify = async (passkey: string) => {
    try {
      await verifyMutation.mutateAsync(passkey);
      // Successfully verified, navigate to the originally requested path
      const returnPath = search.returnPath || '/admin/products';
      navigate({ to: returnPath as any });
    } catch (error: any) {
      // Re-throw to let the prompt component handle the error display
      throw error;
    }
  };

  return (
    <AdminTwoStepAccessPrompt
      onLogin={handleLogin}
      onVerify={handleVerify}
      isLoggingIn={loginStatus === 'logging-in'}
      isVerifying={verifyMutation.isPending}
      isAuthenticated={!!identity}
    />
  );
}
