# Specification

## Summary
**Goal:** Fix admin passkey login so it works reliably on the published (production) site the same way it works in draft, and provide clearer, diagnosable error feedback.

**Planned changes:**
- Update the admin passkey verification flow so correct passkeys successfully unlock admin access on production and allow admin-only backend queries to work without authorization errors.
- Refactor the admin passkey verification hook to use an actor creation/authentication path that does not rely on optional secret-token bootstrapping or shared `useActor()` initialization behavior.
- Improve admin login error reporting: log sanitized, contextual failure details to the console (environment + step), and show clear English UI messages distinguishing invalid passkey vs connectivity/backend failures.

**User-visible outcome:** On the published site, entering the correct admin passkey successfully signs in and redirects into the admin area (e.g., `/admin/products`), admin pages load without authorization errors, and login failures show clear messages instead of a generic “Authentication failed. Please try again.”
