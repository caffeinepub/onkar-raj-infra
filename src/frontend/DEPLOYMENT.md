# Deployment Guide - Version 24

This document outlines the steps to promote the current draft (Version 24) to production and verify the deployment.

## Pre-Deployment Checklist

1. **Verify Draft Build**
   - Ensure Version 24 preview is working correctly
   - Test all critical user flows:
     - Home page loads
     - Products page displays correctly
     - Contact form submission works
     - Order/Enquiry form submission works
     - Admin login and dashboard access (if applicable)

2. **Backend Connectivity**
   - Confirm the draft can connect to the backend canister
   - Verify public mutations (contact, enquiry) succeed
   - Check admin mutations work when authenticated

## Deployment Steps

1. **Publish to Production**
   - Use the deployment command or UI to publish Version 24
   - Wait for deployment to complete
   - Note the production URL

2. **Post-Deployment Verification**
   - Open the production URL in a fresh browser window (incognito/private mode)
   - Open browser DevTools Console (F12)
   - Look for the build label: `🚀 Version 24`
   - Verify the build date and environment are correct

3. **Functional Testing**
   - **Home Page**: Should load without errors
   - **Products Page**: Should display all products
   - **Contact Page**: 
     - Form should be enabled (not showing connection errors)
     - Submit a test message
     - Verify success toast appears
   - **Order/Enquiry Page**:
     - Form should be enabled
     - Submit a test enquiry
     - Verify success state appears
   - **Admin Access** (if applicable):
     - Navigate to /admin/login
     - Enter passkey
     - Verify dashboard loads

## Troubleshooting

### "Unable to connect to the service" Error

If you see this error on production:

1. **Check Console Logs**
   - Open DevTools Console
   - Look for actor initialization errors
   - Note any network errors

2. **Verify Canister IDs**
   - Ensure frontend is pointing to correct backend canister
   - Check `env.json` or environment configuration

3. **Clear Cache**
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache completely
   - Try in incognito/private mode

4. **Redeploy**
   - If issues persist, trigger a fresh deployment
   - This will re-sync frontend with backend canister IDs

### Connection Timeout

If forms timeout during submission:

1. Check network connectivity
2. Verify backend canister is running
3. Check for rate limiting or quota issues
4. Review backend logs for errors

## Rollback Procedure

If critical issues are found in production:

1. Identify the last known good version
2. Use deployment tools to rollback to that version
3. Investigate issues in draft/staging environment
4. Fix and redeploy when ready

## Success Criteria

Production deployment is successful when:

- ✅ Build label "Version 24" appears in console
- ✅ Home page loads without errors
- ✅ Products page displays correctly
- ✅ Contact form submission succeeds
- ✅ Order/Enquiry form submission succeeds
- ✅ No "Unable to connect" errors appear
- ✅ Admin access works (if applicable)

## Support

If deployment issues persist:

1. Document the exact error messages
2. Capture console logs and network activity
3. Note the steps to reproduce
4. Contact support with this information
