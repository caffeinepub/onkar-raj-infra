# Specification

## Summary
**Goal:** Fix unauthorized admin access by adding a dedicated admin login flow that requires Internet Identity login followed by an admin passkey check via `authenticateAdmin("Ved_ansh@04")`, with clear error handling and session persistence.

**Planned changes:**
- Add/adjust the `/admin*` route guard to show a dedicated admin login screen instead of rendering admin pages when not unlocked.
- Admin login flow: require Internet Identity login first, then prompt for the admin code and only submit verification after a code is entered.
- On admin code submit, call backend `authenticateAdmin(passkey)`; unlock admin routes only on success, otherwise show inline error text (e.g., “Invalid passkey” / clear “not authenticated/actor not available” messaging).
- Backend: ensure `authenticateAdmin` rejects any passkey other than exactly `Ved_ansh@04` with a clear error.
- Persist an “admin unlocked” flag for the current browser session; clear it on “Admin Logout” and also clear it when any admin-only API call returns Unauthorized (returning the user to the admin login screen on next admin navigation).

**User-visible outcome:** Visiting any `/admin*` page prompts the user to sign in with Internet Identity, then enter the admin code; after successful verification, admin pages remain accessible for the browser session (including refresh) until admin logout or an Unauthorized response forces re-locking.
