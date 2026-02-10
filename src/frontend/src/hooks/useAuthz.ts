import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminActor } from './useAdminActor';
import type { UserProfile } from '../backend';
import { adminSession } from '../utils/adminSession';
import { verifyPasskey } from '../utils/adminCredentials';
import { waitForActorReady } from './useActorReady';
import { getEnvironmentLabel } from '../utils/buildInfo';
import { sanitizeError } from '../utils/sanitizeError';

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
  const { actor: adminActor, isFetching: adminActorFetching } = useAdminActor();

  return useMutation({
    mutationFn: async (passkey: string) => {
      const envLabel = getEnvironmentLabel();
      
      try {
        // Step 1: Validate passkey input
        const trimmedPasskey = passkey.trim();
        if (!trimmedPasskey) {
          adminSession.safeClear();
          throw new Error('Passkey is required');
        }

        // Step 2: Verify passkey locally first
        const isValid = verifyPasskey(trimmedPasskey);
        
        if (!isValid) {
          adminSession.safeClear();
          console.error(
            `[Admin Auth] ${envLabel} | Step: Local validation | Result: Invalid passkey`
          );
          throw new Error('Invalid passkey');
        }

        console.log(`[Admin Auth] ${envLabel} | Step: Local validation | Result: Valid`);

        // Step 3: Wait for admin actor to be ready with bounded timeout
        let readyActor;
        try {
          readyActor = await waitForActorReady(
            () => adminActor,
            () => adminActorFetching,
            15000 // 15 second timeout for production
          );
          console.log(`[Admin Auth] ${envLabel} | Step: Actor ready | Result: Success`);
        } catch (error: any) {
          adminSession.safeClear();
          const sanitized = sanitizeError(error);
          console.error(
            `[Admin Auth] ${envLabel} | Step: Actor readiness | Error: ${sanitized}`
          );
          throw new Error('Unable to connect to the service. Please refresh the page and try again.');
        }

        // Step 4: Call backend to authenticate admin with the passkey
        try {
          await readyActor.authenticateWithAdminPasskey(trimmedPasskey);
          console.log(`[Admin Auth] ${envLabel} | Step: Backend authenticate | Result: Success`);
        } catch (error: any) {
          adminSession.safeClear();
          const sanitized = sanitizeError(error);
          console.error(
            `[Admin Auth] ${envLabel} | Step: Backend authenticate | Error: ${sanitized}`
          );
          
          // Surface safe backend error messages
          if (error.message && error.message.includes('Invalid passkey')) {
            throw new Error('Invalid passkey');
          }
          throw new Error('Authentication failed. Please try again.');
        }

        // Step 5: Verify admin status was granted
        try {
          const isAdmin = await readyActor.isCallerAdmin();
          if (!isAdmin) {
            adminSession.safeClear();
            console.error(
              `[Admin Auth] ${envLabel} | Step: Verify admin status | Result: Not granted`
            );
            throw new Error('Admin access was not granted. Please try again or contact support.');
          }
          console.log(`[Admin Auth] ${envLabel} | Step: Verify admin status | Result: Granted`);
        } catch (error: any) {
          adminSession.safeClear();
          const sanitized = sanitizeError(error);
          console.error(
            `[Admin Auth] ${envLabel} | Step: Verify admin status | Error: ${sanitized}`
          );
          throw new Error('Unable to verify admin access. Please refresh the page and try again.');
        }

        // Step 6: Backend authentication successful and verified, unlock admin session
        adminSession.setUnlocked();
        console.log(`[Admin Auth] ${envLabel} | Step: Session unlock | Result: Success`);
        
        // Step 7: Invalidate admin queries so they load immediately with new permissions
        // Do NOT invalidate actor - it would trigger re-initialization and clear admin status
        queryClient.invalidateQueries({ queryKey: ['enquiries'] });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        queryClient.invalidateQueries({ queryKey: ['feedback'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
        
        return true;
      } catch (error: any) {
        // Ensure session is cleared on any error path
        adminSession.safeClear();
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
