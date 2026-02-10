import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { adminSession } from '../utils/adminSession';
import { verifyPasskey } from '../utils/adminCredentials';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passkey: string) => {
      try {
        // Validate passkey input
        const trimmedPasskey = passkey.trim();
        if (!trimmedPasskey) {
          adminSession.clear();
          throw new Error('Passkey is required');
        }

        // Verify passkey locally (frontend-only, no backend or Internet Identity)
        const isValid = verifyPasskey(trimmedPasskey);
        
        if (!isValid) {
          adminSession.clear();
          throw new Error('Invalid passkey');
        }

        // Passkey is correct, unlock admin session
        adminSession.setUnlocked();
        
        // Invalidate actor to reinitialize with admin token
        queryClient.invalidateQueries({ queryKey: ['actor'] });
        
        // Invalidate and refetch admin queries so they load immediately
        queryClient.invalidateQueries({ queryKey: ['enquiries'] });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['feedback'] });
        
        return true;
      } catch (error: any) {
        // Ensure session is cleared on any error path
        adminSession.clear();
        throw error;
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
