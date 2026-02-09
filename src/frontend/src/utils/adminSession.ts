const ADMIN_UNLOCK_KEY = 'admin_session_unlocked';
const ADMIN_PASSKEY_KEY = 'admin_session_passkey';

export const adminSession = {
  isUnlocked(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true';
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
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
  },

  clearPasskey(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_PASSKEY_KEY);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    sessionStorage.removeItem(ADMIN_PASSKEY_KEY);
  },
};
