# Hydration Mismatch Fix

## Problem

Hydration mismatch error caused by:
1. Browser extensions (like Grammarly) adding attributes to HTML
2. LocalStorage access during server-side rendering
3. Client/server HTML differences

**Error Message:**
```
Hydration failed because the server rendered HTML didn't match the client properties
```

## Solutions Applied

### 1. Suppress Hydration Warnings for Browser Extensions

Added `suppressHydrationWarning` to `layout.tsx`:

```tsx
<html lang="en" suppressHydrationWarning>
  <body className={inter.className} suppressHydrationWarning>
```

This allows browser extensions (Grammarly, LastPass, etc.) to modify the DOM without causing errors.

### 2. Fixed LocalStorage Access in TourContext

Updated `TourContext.tsx` to only access localStorage on the client:

**Before:**
```tsx
useEffect(() => {
  const saved = localStorage.getItem('tourProgress')
  // This runs on server too!
}, [])
```

**After:**
```tsx
useEffect(() => {
  setMounted(true)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tourProgress')
    // Now only runs on client
  }
}, [])
```

### 3. Added Mounted State

Prevents localStorage writes during SSR:

```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  if (mounted && typeof window !== 'undefined') {
    localStorage.setItem(...)
  }
}, [visitedStations, currentStation, mounted])
```

## Why This Works

### Server-Side Rendering (SSR) Flow:
1. Next.js renders HTML on server
2. HTML is sent to browser
3. React "hydrates" the HTML on client
4. Browser extensions may modify DOM
5. React checks if client matches server

### Our Fixes:
1. `suppressHydrationWarning` - Tells React to ignore browser extension attributes
2. `typeof window !== 'undefined'` - Only runs code on client
3. `mounted` state - Ensures localStorage only accessed after hydration

## Common Hydration Issues

### Issue 1: Browser Extensions
**Cause:** Extensions like Grammarly add attributes to `<body>`

**Solution:** Use `suppressHydrationWarning`

### Issue 2: LocalStorage
**Cause:** Accessing localStorage during SSR (server doesn't have localStorage)

**Solution:** Check `typeof window !== 'undefined'`

### Issue 3: Date/Time
**Cause:** `Date.now()` or `new Date()` different on server/client

**Solution:** 
```tsx
const [date, setDate] = useState<Date | null>(null)

useEffect(() => {
  setDate(new Date())
}, [])
```

### Issue 4: Random Numbers
**Cause:** `Math.random()` generates different values

**Solution:**
```tsx
const [randomId, setRandomId] = useState<string>('')

useEffect(() => {
  setRandomId(Math.random().toString())
}, [])
```

## Best Practices

### 1. Always Check for Window
```tsx
if (typeof window !== 'undefined') {
  // Client-only code
}
```

### 2. Use useEffect for Client-Only Code
```tsx
useEffect(() => {
  // This only runs on client
}, [])
```

### 3. Initialize State Safely
```tsx
// ❌ Bad - runs on server
const [data] = useState(localStorage.getItem('key'))

// ✅ Good - waits for client
const [data, setData] = useState(null)

useEffect(() => {
  setData(localStorage.getItem('key'))
}, [])
```

### 4. Use suppressHydrationWarning Sparingly
Only use on elements where you expect browser extensions to interfere (html, body).

## Testing

To verify the fix works:

1. **Open DevTools** (F12)
2. **Check Console** - Should see no hydration errors
3. **Test with Extensions** - Disable/enable browser extensions
4. **Test Tour Progress** - Should persist across page refreshes

## Browser Extensions That May Cause Issues

- Grammarly
- LastPass
- Honey
- Google Translate
- Ad blockers
- Dark mode extensions

These extensions often add attributes or modify the DOM, which can trigger hydration warnings.

## Additional Resources

- [React Hydration Docs](https://react.dev/link/hydration-mismatch)
- [Next.js SSR Guide](https://nextjs.org/docs/basic-features/data-fetching)
- [suppressHydrationWarning](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

## Summary

✅ Hydration warnings suppressed for browser extensions
✅ LocalStorage only accessed on client-side
✅ Mounted state prevents SSR issues
✅ All client-only code properly guarded

**The hydration mismatch error is now fixed!**

---

**Last Updated:** December 19, 2025
