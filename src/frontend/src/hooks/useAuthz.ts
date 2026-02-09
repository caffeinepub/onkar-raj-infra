import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
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
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (passkey: string) => {
      // Check if user is authenticated first
      if (!identity) {
        adminSession.clear();
        throw new Error('Please log in with Internet Identity first');
      }

      // Check if actor is available
      if (!actor) {
        adminSession.clear();
        throw new Error('Connection not available. Please try again.');
      }

      // Validate passkey input
      const trimmedPasskey = passkey.trim();
      if (!trimmedPasskey) {
        adminSession.clear();
        throw new Error('Passkey is required');
      }

      try {
        // Call backend to authenticate and grant admin role
        await actor.authenticateAdmin(trimmedPasskey);
        
        // Backend confirmed admin access, mark session as unlocked
        adminSession.setUnlocked();
        
        // Emit session change event
        adminSession.notifyChange();
        
        return true;
      } catch (error: any) {
        // Clear session on any failure
        adminSession.clear();
        
        // Provide user-friendly error messages
        const errorMessage = error.message || '';
        
        if (errorMessage.includes('Invalid passkey')) {
          throw new Error('Invalid passkey');
        }
        
        if (errorMessage.includes('Unauthorized')) {
          throw new Error('Unauthorized access');
        }
        
        // Generic error for any other failure
        throw new Error('Authentication failed. Please try again.');
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
