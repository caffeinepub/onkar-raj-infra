# Specification

## Summary
**Goal:** Fix admin passkey login so it reliably unlocks access to guarded admin pages and loads Enquiries/Messages data immediately after login.

**Planned changes:**
- Persist admin “unlocked” state in `sessionStorage` on successful passkey entry and redirect to the originally requested admin route (returnPath) or a default admin page.
- Update admin route-guard flow so `/admin/enquiries` and `/admin/messages` no longer show an unauthorized state after a successful passkey login.
- Fix admin-only backend authorization initialization so admin data reads work after passkey unlock using the existing `caffeineAdminToken` secret-token mechanism, including for anonymous (non–Internet Identity) sessions.
- Ensure clear UI error messaging when admin authorization/token is missing (no silent failures).
- Make Enquiries and Messages React Query screens refresh reliably after unlock by triggering query invalidation/refetch for `['enquiries']` and `['messages']`.

**User-visible outcome:** After entering passkey `vEDANSH468`, the admin is redirected to the intended admin page and can immediately view Enquiries and Messages without seeing “no access” or needing a manual refresh.
