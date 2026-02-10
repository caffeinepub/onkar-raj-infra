import { useInternetIdentity } from './useInternetIdentity';
import { useQuery } from '@tanstack/react-query';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';

/**
 * Admin-only actor hook that creates a backend actor without secret-token bootstrapping.
 * This ensures admin authentication via authenticateWithAdminPasskey works independently
 * of the URL-based admin token initialization used in useActor().
 * 
 * Use this hook for:
 * - Admin passkey verification flow
 * - Admin-only queries/mutations after session unlock
 */
export function useAdminActor() {
  const { identity } = useInternetIdentity();

  const actorQuery = useQuery<backendInterface>({
    queryKey: ['adminActor', identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      if (!isAuthenticated) {
        // Return anonymous actor if not authenticated
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity
        }
      };

      // Create actor WITHOUT calling _initializeAccessControlWithSecret
      // This preserves admin status granted via authenticateWithAdminPasskey
      const actor = await createActorWithConfig(actorOptions);
      return actor;
    },
    staleTime: Infinity,
    enabled: true,
    retry: 1,
  });

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
    isError: actorQuery.isError,
    error: actorQuery.error,
  };
}
