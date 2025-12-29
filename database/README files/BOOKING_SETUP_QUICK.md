# Booking System - Quick Setup Guide

## Prerequisites
- Node.js and npm installed
- MySQL database running
- Server running on port 5000
- Client running on port 3000

## Setup Steps

### 1. Database Setup

**Run the database schema update:**
```sql
-- Add to your schema.sql file (already included)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    visitor_count INT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(10) NOT NULL,
    special_requirements TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_bookings_phone ON bookings(phone);
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

**Execute in MySQL:**
```bash
mysql -u root -p sewanagala_tour < database/schema.sql
```

### 2. Backend Setup

**Files already created/updated:**
- ✅ `server/controllers/bookingController.js` - All CRUD operations
- ✅ `server/routes/bookingRoutes.js` - API routes
- ✅ `server/server.js` - Route registration

**Verify server routes are registered:**
```javascript
// In server/server.js (already added)
app.use('/api/bookings', require('./routes/bookingRoutes'));
```

**Start the server:**
```bash
cd server
npm install
npm start
```

Server should be running on `http://localhost:5000`

### 3. Frontend Setup

**Files already created/updated:**
- ✅ `client/src/pages/BookingManagement.jsx` - Booking management page
- ✅ `client/src/styles/BookingManagement.css` - Styling
- ✅ `client/src/components/BookingForm.jsx` - Updated to save to DB
- ✅ `client/src/App.js` - Route added
- ✅ `client/src/components/Header.jsx` - Navigation link added

**Start the client:**
```bash
cd client
npm start
```

Client should be running on `http://localhost:3000`

### 4. Testing the System

**Step 1: Book a Tour**
1. Navigate to `http://localhost:3000`
2. Click "📅 Book a Tour" button
3. Fill in form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 7712345678 (10 digits)
   - Date: Select future date
   - Time: Select time slot
   - Visitors: 2
4. Check "I agree to terms"
5. Click "Complete Booking"
6. See confirmation with booking ID

**Step 2: Check Bookings**
1. Navigate to `http://localhost:3000/bookings` or click "My Bookings" in header
2. Enter phone: `7712345678`
3. Click "Search Bookings"
4. See your booking(s) displayed

**Step 3: Edit Booking**
1. Click "✏️ Edit" on any booking
2. Modify fields (e.g., change visitor count to 3)
3. Click "💾 Save Changes"
4. See updated booking in list

**Step 4: Cancel Booking**
1. Click "🗑️ Cancel" on any booking
2. Confirm cancellation in modal
3. See booking status changed to "cancelled"

## API Testing with cURL

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BK1701234567890ABC",
    "phone": "7712345678",
    "name": "John Doe",
    "email": "john@example.com",
    "visitor_count": 2,
    "visit_date": "2025-12-20",
    "visit_time": "10:00 AM",
    "special_requirements": "Wheelchair accessible"
  }'
```

### Get Bookings by Phone
```bash
curl http://localhost:5000/api/bookings/phone/7712345678
```

### Update Booking
```bash
curl -X PUT http://localhost:5000/api/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_count": 3,
    "visit_time": "11:00 AM"
  }'
```

### Cancel Booking
```bash
curl -X DELETE http://localhost:5000/api/bookings/1
```

## Common Issues & Solutions

### Issue: "Cannot GET /api/bookings/phone/..."
**Solution:** Ensure server.js has the booking routes registered:
```javascript
app.use('/api/bookings', require('./routes/bookingRoutes'));
```

### Issue: "No bookings found" even after booking
**Solution:** 
- Verify phone number is exactly 10 digits
- Check database contains the booking:
```sql
SELECT * FROM bookings WHERE phone = '7712345678';
```

### Issue: CORS errors in browser console
**Solution:** Ensure server has CORS enabled:
```javascript
app.use(cors());
```

### Issue: "Phone number is required" error
**Solution:** Phone field in BookingForm must have correct value:
- Make sure `formData.phone` is being captured
- Verify phone validation: `/^\d{10}$/`

### Issue: Edit/Delete buttons disabled for all bookings
**Solution:** Check booking status:
- Only `pending` and `confirmed` status allow edit/delete
- `completed` and `cancelled` statuses are locked

## Database Verification

**Check if bookings table exists:**
```sql
SHOW TABLES;
```

**View all bookings:**
```sql
SELECT * FROM bookings;
```

**View bookings by phone:**
```sql
SELECT * FROM bookings WHERE phone = '7712345678';
```

**View bookings by status:**
```sql
SELECT * FROM bookings WHERE status = 'pending';
```

**Count bookings:**
```sql
SELECT COUNT(*) as total FROM bookings;
```

## File Locations Summary

| File | Location | Purpose |
|------|----------|---------|
| BookingManagement.jsx | `client/src/pages/` | Main booking management page |
| BookingManagement.css | `client/src/styles/` | Styling for booking page |
| BookingForm.jsx | `client/src/components/` | Booking form (updated) |
| bookingController.js | `server/controllers/` | API logic |
| bookingRoutes.js | `server/routes/` | API routes |
| schema.sql | `database/` | Database schema |

## Environment Variables

**Server (.env):**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sewanagala_tour
```

**Client (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

## Next Steps

1. **Test the complete flow** - Book, retrieve, edit, cancel
2. **Verify database records** - Check MySQL for booking data
3. **Test on mobile** - Ensure responsive design works
4. **Deploy to production** - Update API URLs for production server
5. **Add email notifications** (optional) - Send confirmation emails
6. **Create admin dashboard** (optional) - View all bookings

## Support

For issues or questions:
1. Check browser console for errors
2. Check server console for error logs
3. Review database for data
4. Verify all files are in correct locations
5. Ensure all dependencies are installed

## Success Indicators

✅ Booking form submits successfully
✅ Booking appears in database
✅ BookingManagement page retrieves bookings by phone
✅ Edit functionality updates booking in database
✅ Cancel functionality changes status to "cancelled"
✅ All responsive designs work on mobile
✅ Error messages display correctly
✅ No console errors in browser or server
