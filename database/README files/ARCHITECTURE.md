# Factory Tour Guide - User Flow & Architecture

## 🎯 User Journey

### 1. **Home Page** → `/`
```
User arrives at home → Sees hero banner with factory image
         ↓
Views tour features overview
         ↓
Clicks "Start Your Tour" button → Navigates to TourGuide
```

### 2. **Tour Guide** → `/tour`
```
Page loads → Fetches all stations from /api/stations
         ↓
Displays:
  • TourStats - Shows total/visited/remaining stations
  • Interactive Map - User can:
    - Click stations to jump to them
    - Use Previous/Next buttons for sequential tour
    - See green paths for visited stations
    - Zoom in on selected station
    ↓
Search/Filter Section - User can:
  - Search by station name/description
  - Filter by category (Processing, Machinery, Storage, Office, History)
  ↓
Station Cards Grid - Click to view details
```

### 3. **Station Detail** → `/station/:id`
```
Page loads → Fetches station data + media
         ↓
Displays:
  • Station name, number, category
  • Full description
  • Estimated duration
  • Media gallery (images/videos from Cloudinary)
  • Audio guide (if available)
  • Location with Google Maps link
  ↓
User Actions:
  • View media in fullscreen modal
  • Listen to audio guide
  • Share on social media
  • Generate/download QR code
  • Navigate to previous/next station
  • View recommended stations
  ↓
Mark as visited → Logged to localStorage + backend
```

### 4. **Tour Completion**
```
When all stations visited:
  • Completion modal appears
  • Shows completion stats
  • Options to start new tour or return home
  • Toast notification sent
```

---

## 🏗️ System Architecture

### Frontend Stack
```
React 19
├── React Router v7 (Navigation)
├── Context API (TourProvider)
├── Custom Hooks (useMediaGallery, useStations, etc.)
├── Axios (API calls)
├── Framer Motion (Animations)
├── React Icons
└── CSS (Custom styling)
```

### Backend Stack
```
Express.js
├── Routes
│   ├── /api/stations (Station CRUD)
│   ├── /api/media (Media management)
│   └── /api/tours (Analytics)
├── Controllers (Business logic)
├── Middleware (Error handling, validation)
└── Config
    ├── MySQL2 (Database)
    └── Cloudinary (Media storage)
```

### Database Layer
```
MySQL8
├── stations (15 records)
├── media (Images/videos from Cloudinary)
└── tour_logs (Visit tracking)
```

---

## 🔄 Data Flow

### Station Loading
```
TourGuide Component
    ↓
useTour() Hook → TourContext
    ↓
useEffect triggers fetchStations()
    ↓
API: GET /api/stations
    ↓
Backend: stationController.getAllStations()
    ↓
MySQL: SELECT * FROM stations
    ↓
Return stations array
    ↓
Update context + component state
    ↓
Render TourMap + StationCard components
```

### Station Selection
```
User clicks station on map or card
    ↓
handleStationClick(stationId)
    ↓
Animate zoom to station
    ↓
markStationVisited(stationId)
    ↓
Update localStorage['visitedStations']
    ↓
POST /api/tours/log (backend analytics)
    ↓
Component re-renders with visited status
```

### Media Loading
```
User navigates to /station/:id
    ↓
useMediaGallery(stationId) Hook
    ↓
useEffect triggers fetchMedia()
    ↓
API: GET /media/station/:stationId
    ↓
Backend: mediaController.getMediaByStation()
    ↓
MySQL: SELECT * FROM media WHERE station_id = ?
    ↓
Return media array
    ↓
Render MediaViewer with images/videos
```

---

## 🗺️ Map Navigation Architecture

### Canvas-Based Map
```
Map Component
├── Canvas Element (draws map image)
├── Stations Layer (interactive circles)
├── Paths Layer (green lines for visited)
└── Controls
    ├── Previous Button (disabled at start)
    ├── Station Info (name + number)
    ├── Next Button (disabled at end)
    ├── Reset View
    └── Progress indicator
```

### Map Interactions
```
1. Click on Station:
   - Zoom to 2.5x scale
   - Pan to center
   - Mark as visited
   - Draw path to next station

2. Previous Button:
   - Navigate to station_number - 1
   - Repeat zoom/pan sequence

3. Next Button:
   - Navigate to station_number + 1
   - Repeat zoom/pan sequence

4. Reset View:
   - Zoom back to 1x
   - Pan back to origin (0, 0)
```

---

## 💾 Local Storage Strategy

```javascript
// Keys stored in browser localStorage
{
  "visitorId": "visitor_1234567890_abc123",
  "visitedStations": "[1, 2, 3, 5]",
  "tourStartTime": "2025-12-01T10:30:00Z",
  "userPreferences": {
    "theme": "light",
    "language": "en"
  }
}
```

**Purpose:**
- Persist tour progress between sessions
- Track visitor ID across visits
- Store user preferences
- Enable offline mode

---

## 🔐 Security Considerations

### Frontend
- ✅ Input validation on search/filters
- ✅ XSS protection with React escaping
- ✅ CORS enabled with backend
- ✅ No sensitive data in localStorage

### Backend
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via parameterized queries
- ✅ CORS middleware enabled
- ✅ Error handling without sensitive info leaks
- ✅ Rate limiting ready (can be added)

### Future Enhancements
- Add authentication for admin features
- Implement API key validation
- Add request rate limiting
- Encrypt sensitive localStorage data

---

## 📊 Analytics Implementation

### Data Collection
```
Every station visit logs:
├── visitor_id (unique per device)
├── station_id
├── visited_at (timestamp)
└── duration_seconds (calculated)
```

### Metrics Available
```
GET /api/tours/statistics returns:
├── Total visitors (unique visitor_ids)
├── Total visits
├── Most popular stations (by visit count)
└── Recent visitor activity (last 20 visits)
```

### Usage Example
```javascript
// Get comprehensive tour stats
fetch('/api/tours/statistics')
  .then(r => r.json())
  .then(data => {
    console.log(`Total visitors: ${data.data.totalVisitors}`);
    console.log(`Most visited: ${data.data.popularStations[0].name}`);
  });
```

---

## 🚀 Performance Optimization

### Frontend
- ✅ React.memo for component memoization
- ✅ useCallback for function memoization
- ✅ useMemo for expensive calculations
- ✅ Lazy loading for images
- ✅ CSS transitions instead of JavaScript animations

### Backend
- ✅ Database indexing on common queries
- ✅ Pagination ready (can be added)
- ✅ Connection pooling with MySQL2
- ✅ Error handling to prevent crashes

### Deployment
- ✅ Frontend: Production build with minification
- ✅ Backend: PM2/systemd for process management
- ✅ Database: Regular backups
- ✅ CDN: Ready for static asset delivery

---

## 📱 Responsive Breakpoints

```css
Desktop (1025px+)
├── Parallax hero banner
├── 3-4 column station cards
├── Full map height 500px
└── Sidebar support

Tablet (769px - 1024px)
├── Scroll hero banner
├── 2 column station cards
├── Map height 400px
└── Adjusted spacing

Mobile (480px - 768px)
├── Scroll banner
├── 1 column station cards
├── Map height 300px
├── Touch-friendly buttons

Mobile Small (<480px)
├── Minimal spacing
├── Full-width buttons
├── Map height 300px
└── Stacked layout
```

---

## 🔗 Component Dependencies

```
App
├── TourProvider (Context)
├── Header
├── Router
│   ├── Home
│   ├── TourGuide
│   │   ├── TourStats
│   │   ├── TourMap
│   │   │   └── Canvas-based interactive map
│   │   ├── SearchBar
│   │   ├── FilterButtons
│   │   ├── StationCard
│   │   │   └── useTour Hook
│   │   └── TourCompletion
│   ├── StationDetail
│   │   ├── MediaViewer
│   │   ├── ShareButton
│   │   ├── QRCodeGenerator
│   │   ├── StationRecommendations
│   │   └── useMediaGallery Hook
│   └── About
└── Footer
```

---

## 🎓 Key Technologies

### Why These Choices?

1. **Canvas for Map**
   - Better performance than SVG for complex drawings
   - Easier path drawing calculations
   - Smooth animations possible

2. **Context API (no Redux)**
   - Simpler for small to medium apps
   - Reduces bundle size
   - Sufficient for this use case

3. **Image-based Map**
   - Easy to customize
   - Better UX than Google Maps for factory
   - Works offline

4. **Cloudinary**
   - Automatic image optimization
   - Video streaming
   - Advanced image transformations
   - Global CDN

5. **MySQL**
   - Structured relational data
   - Strong querying capabilities
   - Good scaling options

---

## 📈 Future Enhancement Ideas

- [ ] User authentication system
- [ ] Favorite stations feature
- [ ] Notes/comments on stations
- [ ] Gamification (badges, achievements)
- [ ] Multi-language support
- [ ] Offline mode with service workers
- [ ] 360° panoramic views
- [ ] AR station markers
- [ ] Video tour guide
- [ ] Guide booking system
- [ ] Feedback/rating system
- [ ] Admin dashboard

---

## 🧪 Testing Recommendations

### Unit Tests
- Component rendering
- Hook functionality
- Utility functions

### Integration Tests
- API endpoints
- Database queries
- Authentication flow

### E2E Tests
- Complete tour flow
- Pagination/navigation
- Filtering/search
- Media loading

### Performance Tests
- Load testing
- Image optimization
- API response times

---

**Document Version**: 1.0  
**Last Updated**: December 1, 2025
