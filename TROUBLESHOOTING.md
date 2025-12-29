# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: EPERM Error - Operation Not Permitted

**Error Message:**
```
Error: EPERM: operation not permitted, open '.next\trace'
```

**Cause:** 
The `.next` build folder has permission issues or is locked by another process.

**Solution:**
```powershell
# Stop all node processes
Stop-Process -Name "node" -Force

# Delete .next folder
Remove-Item -Path ".next" -Recurse -Force

# Restart dev server
npm run dev
```

---

### Issue 2: React Icons Import Error

**Error Message:**
```
'FaSugar' is not exported from 'react-icons/fa'
```

**Solution:**
Already fixed! We changed `FaSugar` to `GiSugarCane` from `react-icons/gi`.

---

### Issue 3: Port 3000 Already in Use

**Error Message:**
```
Port 3000 is already in use
```

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or run on different port
npm run dev -- -p 3001
```

---

### Issue 4: Database Connection Failed

**Error Message:**
```
Cannot connect to database
```

**Solution:**
1. Check if MySQL is running:
```bash
mysql --version
```

2. Update `.env.local`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sewanagala_sugar_tour
```

3. Create database:
```sql
CREATE DATABASE sewanagala_sugar_tour;
SOURCE database/schema.sql;
```

---

### Issue 5: Module Not Found Errors

**Error Message:**
```
Cannot find module 'package-name'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or for specific package
npm install package-name
```

---

### Issue 6: TypeScript Errors

**Error Message:**
```
Type errors in TypeScript files
```

**Solution:**
```bash
# Check for errors
npm run lint

# Regenerate TypeScript config
npx tsc --init
```

---

### Issue 7: Styles Not Loading

**Symptoms:**
- Plain HTML without styles
- Tailwind classes not working

**Solution:**
1. Check `tailwind.config.ts` exists
2. Verify `globals.css` has Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
3. Restart dev server

---

### Issue 8: API Routes Return 404

**Solution:**
1. Ensure files are in `src/app/api/` folder
2. File must be named `route.ts`
3. Export GET, POST, etc. functions
4. Restart dev server after creating new routes

---

### Issue 9: Images Not Loading

**Solution:**
1. Place images in `public/images/` folder
2. Use in code: `/images/filename.jpg`
3. For Cloudinary images, check environment variables:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

1. **Restart Dev Server**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

2. **Clear Build Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Check Environment Variables**
   - Verify `.env.local` exists
   - Check all required variables are set

5. **Check Database**
   - MySQL is running
   - Database exists
   - Tables are created

---

## Getting Help

If issues persist:

1. **Check Error Messages**
   - Read the full error in terminal
   - Check browser console (F12)

2. **Check Logs**
   - Terminal where `npm run dev` is running
   - Browser developer tools console

3. **Common Commands**
   ```bash
   # Check Node version
   node --version
   
   # Check npm version
   npm --version
   
   # Check installed packages
   npm list
   
   # Clear npm cache
   npm cache clean --force
   ```

4. **Documentation**
   - Next.js: https://nextjs.org/docs
   - React: https://react.dev
   - Tailwind: https://tailwindcss.com/docs

---

## Prevention Tips

1. **Always commit before major changes**
   ```bash
   git add .
   git commit -m "Working state"
   ```

2. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

3. **Use `.gitignore`**
   - Already configured
   - Never commit `node_modules` or `.env.local`

4. **Regular backups**
   - Backup database regularly
   - Keep `.env.local` backup separately

---

## Emergency Recovery

If everything breaks:

```bash
# 1. Stop all processes
Stop-Process -Name "node" -Force

# 2. Clean everything
Remove-Item -Path ".next", "node_modules" -Recurse -Force

# 3. Fresh install
npm install

# 4. Start fresh
npm run dev
```

---

## Performance Issues

If the app is slow:

1. **Check bundle size**
   ```bash
   npm run build
   # Review output
   ```

2. **Optimize images**
   - Use Next.js Image component
   - Compress large images

3. **Database queries**
   - Add indexes to frequently queried columns
   - Use connection pooling (already implemented)

4. **Enable caching**
   - Configure in `next.config.js`
   - Use Redis for session storage (optional)

---

**Last Updated:** December 19, 2025
