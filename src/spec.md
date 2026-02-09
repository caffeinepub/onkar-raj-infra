# Specification

## Summary
**Goal:** Fix the failing admin passkey flow by rebuilding a dedicated, passkey-only `/admin/login` that unlocks admin access once per browser session, without changing the existing admin dashboard UI.

**Planned changes:**
- Rebuild `/admin/login` to use only the hard-coded passkey `vEDANSH468` (no Internet Identity login) and, on success, unlock admin access via the existing `sessionStorage`-based admin session mechanism.
- Update admin route protection to rely only on the admin session unlock state: redirect locked sessions to `/admin/login` with a `returnPath`, and keep all admin dashboard pages/layout unchanged when unlocked.
- Refactor passkey verification logic to remove Internet Identity dependency and ensure consistent behavior: unlock on success; clear the admin session and show an error on any failure.

**User-visible outcome:** Admin users can visit `/admin/login`, enter the passkey `vEDANSH468` to access the existing admin dashboard for the current browser session, and are redirected back to the originally requested admin page; incorrect/empty passkeys show an error and do not grant access.
