import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { adminSession } from '../utils/adminSession';

export function useIsCallerAdmin() {
  // This hook is deprecated for admin route guarding
  // Admin access is now determined solely by session unlock state
  // Kept for backward compatibility but returns session state instead of backend check
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      return adminSession.isUnlocked();
    },
    staleTime: 0,
  });
}

export function useVerifyAdminPasskey() {
  return useMutation({
    mutationFn: async (passkey: string) => {
      // Simple client-side passkey verification
      const ADMIN_PASSKEY = 'Ved_ansh@04';
      
      if (!passkey || passkey.trim() !== ADMIN_PASSKEY) {
        // Clear any stored passkey on failure
        adminSession.clear();
        throw new Error('Invalid passkey');
      }
      
      try {
        // Store the passkey in session for subsequent admin calls
        adminSession.setPasskey(passkey.trim());
        
        // Emit session change event
        adminSession.notifyChange();
        
        return true;
      } catch (error: any) {
        // Clear any stored passkey on failure
        adminSession.clear();
        throw new Error('An error occurred. Please try again.');
      }
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();

  return async (profile: UserProfile) => {
    if (!actor) throw new Error('Actor not available');
    return actor.saveCallerUserProfile(profile);
  };
}
