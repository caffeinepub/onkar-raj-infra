import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
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
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (passkey: string) => {
      try {
        // Validate passkey input
        const trimmedPasskey = passkey.trim();
        if (!trimmedPasskey) {
          adminSession.clear();
          throw new Error('Passkey is required');
        }

        // Verify passkey locally first
        const isValid = verifyPasskey(trimmedPasskey);
        
        if (!isValid) {
          adminSession.clear();
          throw new Error('Invalid passkey');
        }

        // Ensure user is logged in with Internet Identity
        if (!identity) {
          adminSession.clear();
          throw new Error('You must be logged in to access admin features');
        }

        // Ensure actor is available
        if (!actor) {
          adminSession.clear();
          throw new Error('Unable to connect to the service. Please refresh the page and try again.');
        }

        // Call backend to authenticate admin with the passkey
        try {
          await actor.authenticateAdmin(trimmedPasskey);
        } catch (error: any) {
          adminSession.clear();
          if (error.message && error.message.includes('Invalid passkey')) {
            throw new Error('Invalid passkey');
          }
          throw new Error('Failed to authenticate. Please try again.');
        }

        // Backend authentication successful, unlock admin session
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
