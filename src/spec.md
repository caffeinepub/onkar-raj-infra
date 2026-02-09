# Specification

## Summary
**Goal:** Restore version-10-style passkey-only admin unlock so the correct passkey unlocks `/admin` without requiring Internet Identity, and fix the regression where failures are incorrectly shown as “Invalid passkey”.

**Planned changes:**
- Fix the `/admin` unlock/verification flow so passkey `Ved_ansh@04` successfully unlocks an admin session and allows access to all `/admin/*` routes without requiring Internet Identity login.
- Ensure passkey-only unlock works even when the user is currently logged into Internet Identity (no need to log out for admin access).
- Persist admin unlock state and stored passkey for the duration of the browser session; clear it on explicit “Admin Logout”.
- Update admin verification error handling to distinguish true backend “Invalid passkey” rejections from service/initialization/network failures, showing appropriate English messages and clearing session state on failed attempts.

**User-visible outcome:** Visiting any `/admin/*` route shows a passkey prompt; entering `Ved_ansh@04` unlocks admin pages for the rest of the browser session (including direct navigation to admin subpages) without Internet Identity being required, and error messages correctly reflect whether the passkey is wrong vs the service is unavailable.
