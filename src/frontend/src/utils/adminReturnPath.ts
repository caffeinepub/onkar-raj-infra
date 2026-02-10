const RETURN_PATH_KEY = 'admin_return_path';

export const adminReturnPath = {
  set(path: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(RETURN_PATH_KEY, path);
  },

  get(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(RETURN_PATH_KEY);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(RETURN_PATH_KEY);
  },
};
