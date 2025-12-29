# Sewanagala Sugar Factory Tour - Complete Setup Guide

## 🎯 Project Overview

A fully-functional interactive factory tour application featuring:
- **Interactive Map Navigation** - Image-based map with station points and path drawing
- **Tour Progress Tracking** - Real-time visited stations tracking with localStorage
- **Media Gallery** - Cloudinary-integrated image/video galleries
- **Responsive Design** - Mobile-first design with tailored breakpoints
- **Tour Statistics** - Visitor tracking and analytics
- **Share & QR Codes** - Social sharing and station QR codes
- **Station Recommendations** - Smart recommendations based on categories

---

## 📋 Prerequisites

- Node.js v16+ and npm/yarn
- MySQL v8.0+
- Cloudinary account (for media storage)
- Git

---

## 🚀 Installation & Setup

### Step 1: Clone/Setup Repository
```bash
cd d:\Sewanagala Projects\sewanagala-sugar-tour
```

### Step 2: Setup Database

#### Create MySQL Database
```sql
-- Run the schema.sql file in your MySQL client
mysql -u root -p < database/schema.sql
```

This creates:
- `sewanagala_tour` database
- `stations` table with 15 pre-populated stations
- `media` table for images/videos
- `tour_logs` table for visitor tracking

#### Verify Data
```bash
mysql -u root -p sewanagala_tour
SELECT * FROM stations;
SELECT COUNT(*) as total_stations FROM stations;
```

### Step 3: Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sewanagala_tour
NODE_ENV=development

# Cloudinary Credentials (optional, for media uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Step 4: Setup Frontend Client

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (optional - proxy is set in package.json)
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start development client
npm start
# Client runs on http://localhost:3000
```

---

## 🗺️ Interactive Map Feature

### How It Works
1. **Image-Based Map**: Uses `MAP_LAYOUT.png` from `/public/images/`
2. **Station Positioning**: Each station has `map_x` and `map_y` coordinates
3. **Path Drawing**: Green lines draw between visited stations
4. **Navigation**: 
   - Click stations to jump to them
   - Use Previous/Next buttons for sequential navigation
   - Zoom in automatically on selected station
   - Reset view button to see full map

### Map Coordinates
Coordinates are stored in the `stations` table:
- `map_x`: X coordinate on the map image (pixels)
- `map_y`: Y coordinate on the map image (pixels)

To update coordinates, use:
```sql
UPDATE stations SET map_x = 100, map_y = 80 WHERE id = 1;
```

---

## 📱 Frontend Features

### Tour Guide Page (`/tour`)
- **TourStats**: Displays total, visited, and remaining stations
- **Interactive Map**: Full map navigation with smooth transitions
- **Search & Filter**: Search stations by name/description, filter by category
- **Station Cards**: Click to view detailed station information
- **Real-time Updates**: Visited status updates instantly

### Station Detail Page (`/station/:id`)
- **Full Description**: Complete station information
- **Media Gallery**: Images and videos from Cloudinary
- **Audio Guide**: Built-in audio player (if audio_guide_url exists)
- **Navigation**: Previous/Next station buttons
- **Sharing**: Share on social media or copy link
- **QR Code**: Generate and download station QR code
- **Recommendations**: Suggested unvisited stations

### Home Page (`/`)
- **Hero Banner**: Fixed parallax background (desktop), responsive (mobile)
- **Feature Highlights**: Tour features overview
- **CTA Sections**: Call-to-action buttons

---

## 🔧 API Endpoints

### Stations
```
GET    /api/stations              - Get all stations
GET    /api/stations/:id          - Get single station
GET    /api/stations/category/:category  - Get stations by category
POST   /api/stations              - Create station (admin)
PUT    /api/stations/:id          - Update station (admin)
DELETE /api/stations/:id          - Delete station (admin)
```

### Media
```
GET    /api/media/station/:stationId  - Get media for station
GET    /api/media/:id                  - Get single media item
POST   /api/media/upload/image        - Upload image (requires Cloudinary)
POST   /api/media/upload/video        - Upload video (requires Cloudinary)
PUT    /api/media/:id                  - Update media metadata
DELETE /api/media/:id                  - Delete media
```

### Tours (Analytics)
```
POST   /api/tours/log                    - Log station visit
GET    /api/tours/visitor/:visitorId    - Get visitor history
GET    /api/tours/statistics            - Get tour statistics
```

---

## 💾 Data Models

### Stations Table
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(255) - Station name
description     TEXT - Full description
station_number  INT UNIQUE - Display number (1-15)
latitude        DECIMAL(10,8) - GPS latitude
longitude       DECIMAL(11,8) - GPS longitude
map_x           INT - X coordinate on map image
map_y           INT - Y coordinate on map image
category        ENUM - processing|machinery|storage|office|history
duration_minutes INT - Estimated visit duration
audio_guide_url VARCHAR(500) - URL to audio guide
is_active       BOOLEAN - Active/inactive status
```

### Media Table
```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
station_id            INT FOREIGN KEY
media_type            ENUM - image|video
cloudinary_url        VARCHAR(500) - URL to media on Cloudinary
cloudinary_public_id  VARCHAR(255) - Cloudinary public ID
title                 VARCHAR(255)
description           TEXT
display_order         INT - Ordering in gallery
```

### Tour Logs Table
```sql
id               INT PRIMARY KEY AUTO_INCREMENT
visitor_id       VARCHAR(100) - Unique visitor identifier
station_id       INT FOREIGN KEY
visited_at       TIMESTAMP - Visit timestamp
duration_seconds INT - Time spent at station
```

---

## 🎨 Customization

### Add New Station
```sql
INSERT INTO stations 
(name, description, station_number, latitude, longitude, map_x, map_y, category, duration_minutes)
VALUES 
('Station Name', 'Description...', 16, 6.8833, 81.3000, 100, 200, 'processing', 10);
```

### Update Station Map Position
1. Edit the map image to identify new coordinates
2. Update the database:
```sql
UPDATE stations SET map_x = 250, map_y = 180 WHERE station_number = 5;
```

### Add Media to Station
Use the admin upload endpoint or upload directly to Cloudinary and insert:
```sql
INSERT INTO media 
(station_id, media_type, cloudinary_url, title, display_order)
VALUES 
(1, 'image', 'https://res.cloudinary.com/...', 'Reception Area', 1);
```

### Customize Colors
Edit `/client/src/App.css` CSS variables:
```css
:root {
  --primary-color: #2c5f2d;     /* Main green */
  --secondary-color: #97bf0d;   /* Accent lime */
  --dark-color: #1a1a1a;        /* Text */
  --light-color: #f5f5f5;       /* Backgrounds */
  --white: #ffffff;
}
```

---

## 🔐 Environment Variables

### Server (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql_password
DB_NAME=sewanagala_tour
NODE_ENV=development
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Client (.env - optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Production Build

### Build Frontend
```bash
cd client
npm run build
# Creates optimized build in /client/build
```

### Deploy to Production
1. Build frontend: `npm run build`
2. Serve build folder with production server
3. Deploy backend to Node.js hosting (Heroku, AWS, DigitalOcean, etc.)
4. Update `.env` with production database credentials
5. Ensure MySQL database is accessible from production server

---

## 🐛 Troubleshooting

### "Cannot GET /api/stations"
- Ensure server is running on port 5000
- Check database connection in server console

### "Database connection failed"
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `sewanagala_tour` exists

### Map image not loading
- Verify `MAP_LAYOUT.png` exists in `/client/public/images/`
- Check image path in TourMap.jsx

### Visited stations not persisting
- Check browser localStorage is enabled
- Clear localStorage and refresh: `localStorage.clear()`

### Media not uploading
- Verify Cloudinary credentials
- Check multer upload directory exists: `/server/uploads/`

### CORS errors
- Ensure CORS is enabled in server (`cors()` middleware)
- Verify API_URL matches backend URL in client

---

## 📊 Features Checklist

- ✅ Interactive image-based factory map
- ✅ Station navigation with smooth transitions
- ✅ Visited stations path drawing
- ✅ Previous/Next navigation buttons
- ✅ Station search and filtering
- ✅ Tour progress tracking
- ✅ Media gallery with Cloudinary
- ✅ Audio guide support
- ✅ Social media sharing
- ✅ QR code generation
- ✅ Visitor analytics
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Station recommendations
- ✅ Tour completion modal

---

## 📚 Additional Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **React Router Docs**: https://reactrouter.com
- **Express.js Docs**: https://expressjs.com
- **MySQL Docs**: https://dev.mysql.com/doc/

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check server logs in terminal
4. Review database connection settings

---

**Last Updated**: December 1, 2025
**Version**: 1.0.0
