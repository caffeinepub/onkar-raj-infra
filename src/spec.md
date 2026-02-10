# Specification

## Summary
**Goal:** Restore full admin access (including enquiries and messages) after entering the shared admin passkey on the existing admin login page.

**Planned changes:**
- Ensure entering passkey `vEDANSH468` unlocks admin status for the remainder of the browser session (until logout/session clear).
- Fix the regression where admin-only pages (/admin/enquiries, /admin/messages) and admin-only backend methods return Unauthorized by making the passkey verification flow also authenticate the caller with the backend’s admin authorization mechanism.
- Show an English error message and keep the admin session locked when the passkey is empty/whitespace or incorrect.
- Keep the admin passkey hard-coded as `vEDANSH468` with no UI/settings to change it.

**User-visible outcome:** After entering the correct passkey once, the user can access admin-only pages (including enquiries and messages) and perform existing admin operations without Unauthorized/no-access errors for that browser session.
