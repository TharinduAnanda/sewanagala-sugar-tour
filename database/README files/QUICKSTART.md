# 🚀 Quick Start Guide

## TL;DR - Get Running in 5 Minutes

### Prerequisites Check
```bash
# Check Node.js version (need 16+)
node --version

# Check npm
npm --version

# MySQL should be running
```

### 1️⃣ Database Setup
```bash
# Open MySQL and run:
mysql -u root -p

# In MySQL client:
SOURCE database/schema.sql;
EXIT;
```

### 2️⃣ Start Backend
```bash
cd server

# Create .env file with:
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=sewanagala_tour
# NODE_ENV=development

npm install
npm run dev

# Should see: 🚀 Server running on port 5000
```

### 3️⃣ Start Frontend (New Terminal)
```bash
cd client

npm install
npm start

# Should open http://localhost:3000 automatically
```

### 4️⃣ Test the Application
1. Click "Start Your Tour" on home page
2. See the interactive factory map
3. Click on stations or use Previous/Next buttons
4. View station details by clicking cards
5. Check visited stations get marked

✅ **You're Done!**

---

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "Port 3000 in use" | `npx kill-port 3000` or use `PORT=3001 npm start` |
| "Cannot connect to database" | Check MySQL is running, verify credentials in .env |
| "Cannot GET /api/stations" | Make sure server is running on 5000 |
| "Map image not found" | Ensure `MAP_LAYOUT.png` exists in `/client/public/images/` |
| "Module not found" | Run `npm install` in both client and server folders |

---

## Key Endpoints to Test

```bash
# Test backend health
curl http://localhost:5000/api/health

# Get all stations
curl http://localhost:5000/api/stations

# Get specific station
curl http://localhost:5000/api/stations/1

# Get tour statistics
curl http://localhost:5000/api/tours/statistics
```

---

## Project Structure

```
sewanagala-sugar-tour/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # TourGuide, StationDetail, Home, About
│   │   ├── components/    # TourMap, StationCard, etc.
│   │   ├── context/       # TourContext
│   │   ├── hooks/         # useMediaGallery, useStations, etc.
│   │   └── services/      # API calls
│   └── public/
│       └── images/        # MAP_LAYOUT.png, hero.jpg
├── server/                # Express backend
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   └── config/           # Database, Cloudinary
├── database/             # schema.sql, sample_data.sql
├── SETUP_GUIDE.md        # Detailed setup instructions
└── ARCHITECTURE.md       # System design & data flow
```

---

## 🎮 Features to Try

### 1. Interactive Map
- Click different stations
- Watch the zoom and pan animation
- See green path draw for visited stations
- Use Previous/Next buttons

### 2. Search & Filter
- Search for station names
- Filter by category (Processing, Machinery, etc.)
- Results update in real-time

### 3. Station Details
- Click any station card
- View full description and media
- Try sharing on social media
- Generate QR code

### 4. Tour Progress
- Visit multiple stations
- See TourStats update
- Complete all stations to see completion modal
- Progress persists in browser (localStorage)

---

## Useful Commands

```bash
# Backend
cd server
npm run dev      # Start with nodemon (hot reload)
npm start        # Start normally
npm test         # Run tests (if configured)

# Frontend
cd client
npm start        # Start dev server
npm run build    # Create production build
npm test         # Run tests
npm run eject    # Expose CRA configuration
```

---

## Environment Files

### `/server/.env`
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sewanagala_tour
NODE_ENV=development
CLOUDINARY_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

### `/client/.env` (optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Database Commands

```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE sewanagala_tour;

# View all stations
SELECT id, station_number, name, category FROM stations;

# View visit logs
SELECT * FROM tour_logs LIMIT 10;

# View media
SELECT * FROM media WHERE station_id = 1;

# Count visitors
SELECT COUNT(DISTINCT visitor_id) as total_visitors FROM tour_logs;
```

---

## Browser Storage (Debugging)

In browser console:
```javascript
// View stored tour data
console.log(localStorage.getItem('visitorId'));
console.log(JSON.parse(localStorage.getItem('visitedStations')));

// Clear tour progress
localStorage.removeItem('visitedStations');

// Refresh page to see changes
location.reload();
```

---

## Useful Browser Dev Tools

1. **React DevTools** (Chrome/Firefox extension)
   - Inspect component props
   - View context state
   - Profile performance

2. **Redux DevTools** (not used, but useful for debugging)
   - View state changes

3. **Network Tab**
   - Monitor API calls
   - Check request/response data
   - Identify slow requests

---

## Deployment Checklist

Before deploying to production:

- [ ] Build frontend: `npm run build` (in client/)
- [ ] Run production tests
- [ ] Update `.env` with production database
- [ ] Set `NODE_ENV=production` in server
- [ ] Configure CORS for production domain
- [ ] Setup HTTPS/SSL certificate
- [ ] Enable database backups
- [ ] Configure error logging
- [ ] Test all API endpoints
- [ ] Verify media uploads work
- [ ] Test on multiple devices/browsers

---

## Need Help?

1. Check **SETUP_GUIDE.md** for detailed instructions
2. Review **ARCHITECTURE.md** for system design
3. Check browser console for JavaScript errors
4. Check terminal for backend errors
5. Verify database connection settings

---

## Next Steps

After getting running:
1. Customize map coordinates for your factory layout
2. Add real media to stations (images/videos)
3. Configure Cloudinary for media uploads
4. Add audio guides for stations
5. Implement admin dashboard
6. Setup production database
7. Deploy to cloud hosting

---

**Happy Touring! 🎉**

Last Updated: December 1, 2025
