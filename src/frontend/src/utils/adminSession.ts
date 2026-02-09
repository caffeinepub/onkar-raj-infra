const ADMIN_UNLOCK_KEY = 'admin_session_unlocked';
const ADMIN_PASSKEY_KEY = 'admin_session_passkey';
const SESSION_CHANGE_EVENT = 'admin-session-change';

export const adminSession = {
  isUnlocked(): boolean {
    if (typeof window === 'undefined') return false;
    const unlocked = sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true';
    const hasPasskey = !!sessionStorage.getItem(ADMIN_PASSKEY_KEY);
    // Only consider unlocked if both flags are present
    return unlocked && hasPasskey;
  },

  setUnlocked(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
  },

  getPasskey(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(ADMIN_PASSKEY_KEY);
  },

  setPasskey(passkey: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(ADMIN_PASSKEY_KEY, passkey);
    // Automatically set unlocked when passkey is stored
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
  },

  clearPasskey(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_PASSKEY_KEY);
    // Also clear unlock state when passkey is cleared
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    sessionStorage.removeItem(ADMIN_PASSKEY_KEY);
    this.notifyChange();
  },

  // Admin logout - clears session and forces re-authentication
  logout(): void {
    this.clear();
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
