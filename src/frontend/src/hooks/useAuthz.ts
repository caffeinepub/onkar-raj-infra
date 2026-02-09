import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { adminSession } from '../utils/adminSession';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
  });
}

export function useVerifyAdminPasskey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passkey: string) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // Test the passkey by calling an admin method (getAllProducts is a safe read-only test)
        await actor.getAllEnquiries(passkey);
        
        // Store the passkey in session for subsequent admin calls
        adminSession.setPasskey(passkey);
        
        return true;
      } catch (error: any) {
        // Clear any stored passkey on failure
        adminSession.clearPasskey();
        
        // Provide user-friendly error message
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('Invalid passkey. Please check and try again.');
        }
        throw new Error('Verification failed. Please check your passkey.');
      }
    },
    onSuccess: async () => {
      // Proactively set admin status to true in cache
      queryClient.setQueryData(['isAdmin'], true);
      
      // Invalidate and refetch to ensure backend truth
      await queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
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
