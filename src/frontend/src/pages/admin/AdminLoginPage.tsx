import { useNavigate, useSearch } from '@tanstack/react-router';
import { useVerifyAdminPasskey } from '../../hooks/useAuthz';
import AdminTwoStepAccessPrompt from './AdminTwoStepAccessPrompt';
import { useEffect, useState } from 'react';
import { adminSession } from '../../utils/adminSession';
import { adminReturnPath } from '../../utils/adminReturnPath';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/admin/login' }) as { returnPath?: string };
  const verifyMutation = useVerifyAdminPasskey();
  const [isProcessing, setIsProcessing] = useState(false);

  // If already unlocked, redirect to admin immediately
  useEffect(() => {
    if (adminSession.isUnlocked()) {
      const returnPath = search.returnPath || adminReturnPath.get() || '/admin/products';
      adminReturnPath.clear();
      navigate({ to: returnPath as any });
    }
  }, [navigate, search.returnPath]);

  const handlePasskeySubmit = async (passkey: string) => {
    // Prevent double submission
    if (isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Verify passkey and authenticate with backend
      await verifyMutation.mutateAsync(passkey);

      // Successfully verified and unlocked, navigate to the originally requested path
      const returnPath = search.returnPath || adminReturnPath.get() || '/admin/products';
      adminReturnPath.clear();
      
      // Small delay to ensure session state is propagated
      setTimeout(() => {
        navigate({ to: returnPath as any });
        setIsProcessing(false);
      }, 100);
    } catch (error: any) {
      // Error is already logged in useAuthz, reset processing state
      setIsProcessing(false);
      // Re-throw to let the UI component display the error
      throw error;
    }
  };

  return (
    <AdminTwoStepAccessPrompt
      onPasskeySubmit={handlePasskeySubmit}
      isProcessing={isProcessing || verifyMutation.isPending}
    />
  );
}
