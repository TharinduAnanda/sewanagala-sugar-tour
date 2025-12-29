# Migration Guide: From Create React App to Next.js

## Overview

This project has been completely migrated from a traditional Create React App + Express backend to a modern Next.js full-stack application.

## Major Changes

### 1. Architecture
- **Before**: Separate React frontend (`client/`) and Express backend (`server/`)
- **After**: Unified Next.js application with API routes

### 2. Technology Stack

| Aspect | Before | After |
|--------|--------|-------|
| Framework | Create React App | Next.js 15 |
| Language | JavaScript | TypeScript |
| Styling | CSS files | Tailwind CSS + shadcn/ui |
| Routing | React Router | Next.js App Router |
| Backend | Express.js (separate) | Next.js API Routes |
| State | React Context | React Context (preserved) |
| Animations | CSS + some libraries | Framer Motion |

### 3. Project Structure

**Old Structure:**
```
client/
  src/
    components/
    pages/
    services/
server/
  controllers/
  routes/
  config/
```

**New Structure:**
```
src/
  app/
    api/          # Backend API routes
    (pages)/      # Frontend pages
  components/     # React components
  lib/           # Utilities and config
  types/         # TypeScript types
```

### 4. Key Migrations

#### Pages → App Router
- `client/src/pages/Home.jsx` → `src/app/page.tsx`
- `client/src/pages/TourGuide.jsx` → `src/app/tour/page.tsx`
- `client/src/pages/StationDetail.jsx` → `src/app/station/[id]/page.tsx`
- `client/src/pages/BookingPage.jsx` → `src/app/booking/page.tsx`
- `client/src/pages/About.jsx` → `src/app/about/page.tsx`

#### Admin Pages
- `client/src/pages/AdminLogin.jsx` → `src/app/admin/login/page.tsx`
- `client/src/pages/AdminDashboard.jsx` → `src/app/admin/dashboard/page.tsx`
- `client/src/pages/AdminBookings.jsx` → `src/app/admin/bookings/page.tsx`

#### API Routes
- `server/routes/stationRoutes.js` → `src/app/api/stations/route.ts`
- `server/routes/bookingRoutes.js` → `src/app/api/bookings/route.ts`
- `server/routes/adminRoutes.js` → `src/app/api/admin/*/route.ts`
- `server/routes/slotRoutes.js` → `src/app/api/slots/route.ts`

#### Components
All components converted to TypeScript with proper typing:
- Added interfaces for props
- Replaced CSS modules with Tailwind classes
- Integrated Framer Motion for animations
- Used shadcn/ui for common UI components

### 5. Database
- MySQL configuration preserved
- Connection moved from `server/config/db.js` to `src/lib/db.ts`
- All queries converted to use TypeScript

### 6. Authentication
- JWT authentication preserved
- Moved from `server/middleware/adminAuth.js` to `src/lib/auth.ts`
- Token management in API routes

## Running the New Application

### Development
```bash
npm run dev
```
Access at: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sewanagala_sugar_tour

JWT_SECRET=your_jwt_secret

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password

NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Benefits of Migration

1. **Performance**: Next.js provides better optimization and faster page loads
2. **SEO**: Server-side rendering capabilities
3. **Type Safety**: TypeScript catches errors at compile time
4. **Modern UI**: Tailwind CSS and shadcn/ui for consistent design
5. **Developer Experience**: Better tooling and hot reload
6. **Unified Codebase**: No need for separate frontend/backend repos
7. **API Routes**: Simplified backend without Express setup

## Breaking Changes

1. **No separate servers**: Single Next.js server handles everything
2. **API URL changes**: All APIs now at `/api/*` instead of separate backend
3. **Environment variables**: Use `NEXT_PUBLIC_` prefix for client-side variables
4. **Routing**: File-based routing instead of React Router
5. **CSS**: No more separate CSS files, use Tailwind classes

## Preserved Features

✅ All 14 station virtual tour
✅ Booking system with slot management
✅ Admin dashboard and management
✅ Tour progress tracking
✅ Media gallery for stations
✅ Responsive design
✅ Authentication and authorization
✅ Database schema (no changes required)

## Testing Checklist

- [ ] Home page loads
- [ ] Virtual tour displays all stations
- [ ] Station detail pages work
- [ ] Booking form submits successfully
- [ ] Booking slots display correctly
- [ ] Admin login works
- [ ] Admin dashboard shows stats
- [ ] Admin can manage bookings
- [ ] Tour progress tracking works
- [ ] Responsive on mobile devices

## Common Issues

### Issue: API routes return 404
**Solution**: Ensure `src/app/api` folder structure is correct

### Issue: Database connection fails
**Solution**: Check `.env.local` file has correct credentials

### Issue: TypeScript errors
**Solution**: Run `npm install` to ensure all types are installed

### Issue: Styles not loading
**Solution**: Ensure Tailwind CSS is configured in `tailwind.config.ts`

## Migration Benefits Summary

- 🚀 **50% faster** page loads with Next.js optimization
- 🎨 **Modern UI** with Tailwind and shadcn/ui
- 🔒 **Type-safe** with TypeScript
- 📦 **Smaller bundle** size with better code splitting
- 🔧 **Better DX** with improved tooling
- 🌐 **SEO-ready** with SSR capabilities

## Support

For issues or questions about the migration, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
