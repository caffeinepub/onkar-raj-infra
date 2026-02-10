import { useState, useEffect } from 'react';
import { adminSession } from '../utils/adminSession';

/**
 * Reactive hook that subscribes to admin session unlock state changes.
 * Returns a boolean that updates when the session is unlocked or cleared.
 */
export function useAdminSession() {
  const [isUnlocked, setIsUnlocked] = useState(adminSession.isUnlocked());

  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setIsUnlocked(adminSession.isUnlocked());
    });
    return unsubscribe;
  }, []);

  return { isUnlocked };
}
