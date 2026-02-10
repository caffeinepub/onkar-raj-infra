import { useActor } from './useActor';
import { useEffect, useState } from 'react';

interface ActorReadyResult {
  isReady: boolean;
  error: string | null;
}

/**
 * Hook to wait for the authenticated actor to be ready after Internet Identity login.
 * Polls with bounded timeout to ensure the actor is available before proceeding.
 */
export function useActorReady(shouldWait: boolean): ActorReadyResult {
  const { actor, isFetching } = useActor();
  const [result, setResult] = useState<ActorReadyResult>({ isReady: false, error: null });

  useEffect(() => {
    if (!shouldWait) {
      setResult({ isReady: false, error: null });
      return;
    }

    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const waitForActor = async () => {
      const startTime = Date.now();
      const timeout = 15000; // 15 seconds for production compatibility
      const pollInterval = 200; // 200ms

      const checkActor = () => {
        if (cancelled) return;

        if (actor && !isFetching) {
          setResult({ isReady: true, error: null });
          return;
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= timeout) {
          setResult({
            isReady: false,
            error: 'Connection timeout. Please refresh the page and try again.',
          });
          return;
        }

        timeoutId = setTimeout(checkActor, pollInterval);
      };

      checkActor();
    };

    waitForActor();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shouldWait, actor, isFetching]);

  return result;
}

/**
 * Utility function to wait for actor readiness with a promise-based API.
 * Returns the actor if it becomes ready, throws error if timeout.
 * Extended timeout for production build compatibility.
 */
export async function waitForActorReady(
  getActor: () => any,
  getIsFetching: () => boolean,
  timeoutMs: number = 15000
): Promise<any> {
  const startTime = Date.now();
  const pollInterval = 200;

  return new Promise((resolve, reject) => {
    const checkActor = () => {
      const actor = getActor();
      const isFetching = getIsFetching();

      if (actor && !isFetching) {
        resolve(actor);
        return;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed >= timeoutMs) {
        reject(new Error('Unable to connect to the service. Please check your connection and try again.'));
        return;
      }

      setTimeout(checkActor, pollInterval);
    };

    checkActor();
  });
}
