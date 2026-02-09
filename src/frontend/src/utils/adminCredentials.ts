// Frontend-only admin passkey verification
// This is a build-time constant for admin unlock
const ADMIN_PASSKEY = 'vEDANSH468';

export function verifyPasskey(passkey: string): boolean {
  const trimmedPasskey = passkey.trim();
  return trimmedPasskey === ADMIN_PASSKEY;
}
