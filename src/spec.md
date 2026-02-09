# Specification

## Summary
**Goal:** Simplify admin unlock to a single passkey-only flow for `/admin`, using the updated static passkey `Ved_ansh@04`, and fix the frontend verification/routing so the correct passkey successfully unlocks admin access.

**Planned changes:**
- Update backend admin verification to remove any email allowlist checks and verify admin access using only the static passkey `Ved_ansh@04`.
- Update the admin unlock UI to a single-step passkey prompt only (remove the email step entirely) and allow non-numeric passkeys (no numeric-only input constraints).
- Adjust the frontend admin verification call path (route guard / verification hook) to match the passkey-only backend logic and route to `/admin/products` on successful verification without showing an error for the correct passkey.

**User-visible outcome:** When a logged-in user visits an `/admin` route, they see only a passkey prompt; entering `Ved_ansh@04` unlocks admin access for the session and sends them to `/admin/products`, while incorrect passkeys show an English error and keep them on the prompt.
