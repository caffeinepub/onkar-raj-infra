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
    setIsProcessing(true);

    try {
      // Verify passkey (frontend-only, no Internet Identity or backend)
      await verifyMutation.mutateAsync(passkey);

      // Successfully verified, navigate to the originally requested path
      const returnPath = search.returnPath || adminReturnPath.get() || '/admin/products';
      adminReturnPath.clear();
      navigate({ to: returnPath as any });
    } catch (error: any) {
      setIsProcessing(false);
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
