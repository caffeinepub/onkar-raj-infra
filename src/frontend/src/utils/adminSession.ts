const ADMIN_UNLOCK_KEY = 'admin_session_unlocked';
const SESSION_CHANGE_EVENT = 'admin-session-change';

export const adminSession = {
  isUnlocked(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true';
  },

  setUnlocked(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
    this.notifyChange();
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    this.notifyChange();
  },

  // Admin logout - clears session and forces re-authentication
  logout(): void {
    this.clear();
  },

  // Idempotent clear - safe to call multiple times
  safeClear(): void {
    try {
      this.clear();
    } catch (error) {
      console.error('Error clearing admin session:', error);
    }
  },

  // Notify listeners that session state has changed
  notifyChange(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
  },

  // Subscribe to session changes
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const handler = () => callback();
    window.addEventListener(SESSION_CHANGE_EVENT, handler);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, handler);
    };
  },
};
