# Railway Deployment Checklist

## ✅ Issues Fixed

### 1. Html Import Error (404 Page) - FIXED
- **Error:** `Error: <Html> should not be imported outside of pages/_document`
- **Root Cause:** Next.js 15 metadata generation issue
- **Solution:** Added explicit `<head />` in layout.tsx and created custom not-found.tsx

### 2. React Hooks Error - FIXED
- **Error:** `TypeError: Cannot read properties of null (reading 'useState')`
- **Root Cause:** Client components being pre-rendered during build
- **Solution:** Added `export const dynamic = 'force-dynamic'` to:
  - `src/app/adjust-map-position/page.tsx`
  - `src/app/booking/page.tsx`

### 3. Key Props Warning - FIXED
- **Error:** `Each child in a list should have a unique "key" prop`
- **Root Cause:** Already fixed in code (keys present)
- **Solution:** Verified all map() calls have proper keys

### 4. NODE_ENV Warning - FIXED
- **Error:** `non-standard "NODE_ENV" value in your environment`
- **Root Cause:** Railway deployment environment configuration
- **Solution:** Created `railway.toml` and updated `.npmrc`

## Files Modified

```
src/app/layout.tsx                      - Added <head /> tag
src/app/adjust-map-position/page.tsx    - Added dynamic export
src/app/booking/page.tsx                - Added dynamic export  
src/app/not-found.tsx                   - Created custom 404 page
railway.toml                            - Created Railway config
.npmrc                                  - Updated npm settings
```

## Deploy to Railway

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix Railway deployment errors - dynamic rendering and custom 404"
git push origin main
```

### Step 2: Environment Variables (Required)
Set these in Railway dashboard:

**Database:**
- `DATABASE_HOST` - Your MySQL host
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password
- `DATABASE_NAME` - Database name

**Authentication:**
- `JWT_SECRET` - Random secret string for JWT tokens

**Email (Optional):**
- `EMAIL_USER` - SMTP email address
- `EMAIL_PASSWORD` - SMTP password

**Cloudinary:**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - API key
- `CLOUDINARY_API_SECRET` - API secret

### Step 3: Verify Build Settings

In Railway dashboard:
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `/` (if repo root)

### Step 4: Deploy
Railway will automatically deploy when you push to main branch.

## Expected Build Output

✅ Successful build should show:
```
   ▲ Next.js 15.5.9
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Database connected successfully
   Generating static pages (X/XX)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB        XXX kB
├ ○ /about                               XXX kB        XXX kB
├ ƒ /adjust-map-position                 XXX kB        XXX kB
├ ○ /admin/...                           XXX kB        XXX kB
└ ƒ /booking                             XXX kB        XXX kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## Post-Deployment Testing

1. **Homepage:** Visit your Railway URL
2. **Booking Page:** Test `/booking` route
3. **Admin Login:** Test `/admin/login`
4. **404 Page:** Visit non-existent route
5. **API Endpoints:** Test `/api/bookings`
6. **Database:** Verify DB connections work

## Troubleshooting

### Build Still Fails?

1. **Clear Railway Cache:**
   - In Railway dashboard: Settings → Deploy → "Clear cache and redeploy"

2. **Check Database Connection:**
   - Verify DATABASE_* environment variables are correct
   - Test connection from Railway environment

3. **Check Build Logs:**
   - Look for specific error messages
   - Verify all dependencies installed

4. **Common Issues:**
   - Missing environment variables → Add in Railway dashboard
   - Database timeout → Check host/port/credentials
   - Module not found → Clear cache and rebuild

### Runtime Errors?

1. **500 Internal Server Error:**
   - Check application logs in Railway
   - Verify database is accessible
   - Check environment variables

2. **Database Connection Failed:**
   - Verify DATABASE_HOST allows Railway IPs
   - Check credentials are correct
   - Ensure database is running

3. **API Routes Not Working:**
   - Check CORS settings
   - Verify JWT_SECRET is set
   - Check API route implementations

## Key Technical Changes

### Dynamic Rendering
Previously, Next.js tried to pre-render all pages at build time. Client components with hooks (useState, useEffect) that interact with browser APIs can't be pre-rendered.

**Solution:** Force dynamic rendering for these pages:
```typescript
export const dynamic = 'force-dynamic'
```

This tells Next.js: "Render this page on-demand when requested, not at build time."

### Custom 404 Page
Next.js 15 App Router requires explicit not-found.tsx file to avoid metadata conflicts.

### Railway Configuration
The `railway.toml` file provides explicit build/deploy instructions to Railway, avoiding environment detection issues.

## Success Indicators

✅ Build completes without errors  
✅ All routes accessible  
✅ Database connections successful  
✅ No console errors  
✅ Booking system functional  
✅ Admin panel accessible  

## Support

If issues persist:
1. Check Railway build logs for specific errors
2. Review Next.js 15 App Router documentation
3. Verify all environment variables are set correctly
4. Test database connectivity separately
