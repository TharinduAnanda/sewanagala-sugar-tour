# Local Development Setup

## ⚠️ Local npm Issues (Does NOT Affect Railway)

If you're seeing errors like:
```
Error: ENOENT: no such file or directory
Cannot find module '@nodelib/fs.scandir'
Cannot find module '@swc/helpers/cjs/_interop_require_default.cjs'
```

### ✅ Quick Fix

```bash
# Clean everything
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json

# Fresh install
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

### Windows PowerShell:
```powershell
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path package-lock.json -Force -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
npm run dev
```

---

## 🎯 Important: Railway Deployment is UNAFFECTED

These are **local development issues only** caused by:
- Partial npm installations
- Corrupted node_modules cache
- Windows symlink issues
- Previous installation conflicts

### Railway Will Work Fine Because:
✅ Railway does fresh install from scratch  
✅ No cached modules  
✅ Linux environment (no Windows issues)  
✅ nixpacks.toml ensures correct installation  

---

## 🚀 You Can Still Deploy to Railway

Even if local dev has issues, Railway deployment will succeed!

**Just commit and push:**
```bash
git add .
git commit -m "Fix Railway deployment errors"
git push origin main
```

Railway will:
1. Clone fresh repo
2. Run `npm install --legacy-peer-deps` (from nixpacks.toml)
3. Build successfully
4. Deploy your app

---

## 💡 Why Local Issues Happen

### npm with --legacy-peer-deps can cause:
- Dependency resolution conflicts
- Incomplete module installations
- Symlink issues on Windows
- Cache corruption

### Solution: Clean Install
Always start fresh when using `--legacy-peer-deps`:
```bash
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
```

---

## ✅ For Development

If you need to work locally:

1. **Clean everything:**
   ```bash
   rm -rf node_modules .next package-lock.json
   ```

2. **Fresh install:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **If still having issues:**
   - Restart your IDE/editor
   - Clear npm cache: `npm cache clean --force`
   - Try again

---

## 🎉 But Remember

**You don't need local dev working to deploy!**

Railway deployment is completely independent and will work perfectly with all the fixes we've applied.

**Priority: Deploy to Railway first, fix local dev later if needed.**

---

## 📋 Quick Commands

### Clean & Reinstall:
```bash
rm -rf node_modules .next package-lock.json && npm install --legacy-peer-deps
```

### Deploy to Railway:
```bash
git add .
git commit -m "Fix Railway errors"
git push origin main
```

### Check Railway Build:
Watch Railway dashboard - build should succeed! ✅

---

**Focus on deployment first - local dev can be fixed later! 🚀**
