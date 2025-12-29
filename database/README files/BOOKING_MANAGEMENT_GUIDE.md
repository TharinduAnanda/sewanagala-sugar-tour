# Booking Management System Documentation

## Overview
A complete tour booking management system that allows users to:
- Book tours through the home page booking form
- Check their bookings using only their phone number
- Edit existing bookings (date, time, visitor count, requirements)
- Cancel/delete bookings
- Download booking confirmations

## System Architecture

### Database Schema
**Bookings Table**
```sql
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
```

**Indexes**
- `idx_bookings_phone` - Fast phone-based lookups
- `idx_bookings_booking_id` - Unique booking ID lookup
- `idx_bookings_status` - Status-based filtering

### Backend API Endpoints

#### 1. Create Booking
- **Endpoint:** `POST /api/bookings`
- **Purpose:** Save a new tour booking
- **Request Body:**
```json
{
  "booking_id": "BK1701234567890ABC",
  "phone": "7712345678",
  "name": "John Doe",
  "email": "john@example.com",
  "visitor_count": 4,
  "visit_date": "2025-12-15",
  "visit_time": "10:00 AM",
  "special_requirements": "Wheelchair accessible"
}
```
- **Response:** `{ success: true, booking_id, id }`
- **Errors:** 400 (missing fields), 500 (database error)

#### 2. Get Bookings by Phone
- **Endpoint:** `GET /api/bookings/phone/:phone`
- **Purpose:** Retrieve all bookings for a phone number
- **Example:** `GET /api/bookings/phone/7712345678`
- **Response:**
```json
{
  "success": true,
  "count": 2,
  "bookings": [
    {
      "id": 1,
      "booking_id": "BK1701234567890ABC",
      "phone": "7712345678",
      "name": "John Doe",
      "email": "john@example.com",
      "visitor_count": 4,
      "visit_date": "2025-12-15",
      "visit_time": "10:00 AM",
      "special_requirements": "Wheelchair accessible",
      "status": "pending",
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-01T10:00:00Z"
    }
  ]
}
```

#### 3. Update Booking
- **Endpoint:** `PUT /api/bookings/:id`
- **Purpose:** Update booking details
- **Request Body:** Any field(s) to update
```json
{
  "visitor_count": 5,
  "visit_date": "2025-12-20",
  "visit_time": "11:00 AM"
}
```
- **Response:** `{ success: true, message: "Booking updated successfully" }`

#### 4. Cancel Booking (Soft Delete)
- **Endpoint:** `DELETE /api/bookings/:id`
- **Purpose:** Mark booking as cancelled (doesn't permanently delete)
- **Response:** `{ success: true, message: "Booking cancelled successfully" }`
- **Note:** Sets status to 'cancelled' and updates timestamp

#### 5. Verify Phone
- **Endpoint:** `GET /api/bookings/verify/:phone`
- **Purpose:** Check if a phone has any bookings
- **Response:**
```json
{
  "success": true,
  "exists": true,
  "count": 2
}
```

#### 6. Get Single Booking
- **Endpoint:** `GET /api/bookings/:id`
- **Purpose:** Retrieve a specific booking by ID
- **Response:** `{ success: true, booking: {...} }`

### Frontend Components

#### BookingForm.jsx
**Location:** `client/src/components/BookingForm.jsx`

**Features:**
- Form validation (email, phone, date, visitor count)
- Auto-generates unique booking ID (format: `BK{timestamp}{randomString}`)
- Saves booking to database via API
- Shows success/error messages
- Displays confirmation after successful booking

**Form Fields:**
- Full Name (required)
- Email (required, validated)
- Phone Number (required, 10 digits)
- Visit Date (required, must be future date)
- Visit Time (required, 9 AM - 4 PM slots)
- Number of Visitors (required, 1-50)
- Special Requirements (optional)
- Terms Agreement (required checkbox)

#### BookingManagement.jsx
**Location:** `client/src/pages/BookingManagement.jsx`

**Views:**
1. **Login View**
   - Phone number input (10 digits only)
   - Searches for bookings by phone
   - Shows error if no bookings found

2. **Bookings List View**
   - Displays all bookings for the phone
   - Shows booking details (date, time, visitors, email)
   - Status badge with color coding
   - Edit/Cancel buttons for active bookings
   - Cannot edit completed or cancelled bookings

3. **Edit Modal**
   - Edit form for booking details
   - Updates selected booking
   - Real-time validation
   - Shows success/error messages

4. **Delete Confirmation Modal**
   - Confirms before cancelling booking
   - Shows booking ID and date/time
   - Safe cancellation with confirmation

**State Management:**
- `currentView` - Current UI view (login, bookings, edit, delete-confirm)
- `phone` - Logged-in user's phone
- `bookings` - Array of user's bookings
- `loading` - Loading state for API calls
- `error` - Error message display
- `success` - Success message display
- `editingBooking` - Currently editing booking
- `deleteConfirm` - Booking awaiting deletion confirmation

### Styling

#### BookingManagement.css
**Location:** `client/src/styles/BookingManagement.css`

**Key Styles:**
- Login card with centered layout
- Responsive booking list with cards
- Status badges with color coding:
  - Pending: Orange (#ff9800)
  - Confirmed: Green (#4caf50)
  - Completed: Blue (#2196f3)
  - Cancelled: Red (#f44336)
- Modal overlays with smooth animations
- Form validation styling with error highlighting
- Mobile responsive (< 768px and < 480px breakpoints)

**Responsive Breakpoints:**
- Desktop: Full layout with side-by-side elements
- Tablet (≤768px): Stacked buttons and form rows
- Mobile (≤480px): Full-width buttons and single column layout

### Routing

**Updated Files:**
- `client/src/App.js` - Added route `/bookings` → `BookingManagement`
- `client/src/components/Header.jsx` - Added "My Bookings" navigation link

**Access Points:**
- Navigation menu: "My Bookings" link
- Home page: After booking confirmation
- Direct URL: `/bookings`

## User Flow

### Booking a Tour
1. User clicks "📅 Book a Tour" on home page
2. BookingForm modal appears
3. User fills in all required fields
4. Form validates input in real-time
5. User submits form
6. Booking is saved to database with unique ID
7. BookingConfirmation modal shows booking details
8. User can download confirmation or start virtual tour

### Managing Bookings
1. User navigates to `/bookings` or "My Bookings" link
2. Enters phone number (10 digits)
3. System retrieves all bookings for that phone
4. User sees booking list with status badges
5. For active bookings:
   - Click "✏️ Edit" to modify details
   - Click "🗑️ Cancel" to cancel booking
6. Confirmation modals appear for destructive actions
7. Changes are saved to database

## API Error Handling

**HTTP Status Codes:**
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST (booking creation)
- `400 Bad Request` - Validation error (missing fields, invalid format)
- `404 Not Found` - Booking ID not found
- `500 Internal Server Error` - Database error

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Database error details (in development only)"
}
```

## Security Considerations

1. **Phone Number Validation**
   - Client-side: Regex validation (10 digits)
   - Server-side: Validated in controller

2. **Data Protection**
   - Personal data (names, emails, phone) stored in database
   - Booking IDs are unique and difficult to guess
   - Status update to "cancelled" instead of hard delete (audit trail)

3. **Soft Deletes**
   - Bookings are marked as cancelled, never permanently deleted
   - Maintains historical record
   - Allows data recovery if needed

## Database Queries

### Retrieve Bookings by Phone
```sql
SELECT * FROM bookings WHERE phone = '7712345678' 
ORDER BY visit_date DESC, visit_time DESC;
```

### Count Bookings by Phone
```sql
SELECT COUNT(*) as count FROM bookings WHERE phone = '7712345678';
```

### Update Booking
```sql
UPDATE bookings 
SET visitor_count = 5, visit_date = '2025-12-20', updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Cancel Booking (Soft Delete)
```sql
UPDATE bookings 
SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

### Retrieve Active Bookings
```sql
SELECT * FROM bookings 
WHERE phone = '7712345678' AND status IN ('pending', 'confirmed')
ORDER BY visit_date ASC;
```

## Integration Points

### BookingForm Integration
- Home.jsx imports BookingForm
- On successful submission, booking is saved to database
- Booking ID is generated and displayed in confirmation
- User can start virtual tour after booking

### Booking Status Flow
```
New Booking → pending → (Admin confirms) → confirmed → (Tour completes) → completed
                    ↓ (User cancels)
                  cancelled
```

## Future Enhancements

1. **Email Notifications**
   - Confirmation email after booking
   - Reminder emails before tour date
   - Cancellation confirmation email

2. **Admin Dashboard**
   - View all bookings
   - Confirm/modify bookings
   - Generate reports
   - View booking statistics

3. **Payment Integration**
   - Payment processing for bookings
   - Invoice generation
   - Refund management

4. **Advanced Features**
   - Group bookings with bulk discount
   - Recurring/seasonal bookings
   - Tour capacity management
   - Waitlist for full tours

5. **Authentication**
   - Optional user accounts
   - Booking history per user
   - Profile management

## Testing the System

### Manual Testing Steps

1. **Test Booking Creation**
   - Navigate to home page
   - Click "Book a Tour"
   - Fill in form with valid data
   - Submit and verify booking confirmation
   - Check database for new booking record

2. **Test Booking Retrieval**
   - Navigate to `/bookings`
   - Enter phone number used in booking
   - Verify bookings are displayed
   - Check booking details are correct

3. **Test Edit Functionality**
   - Click "Edit" on a booking
   - Modify some fields
   - Submit changes
   - Verify changes in booking list

4. **Test Cancel Functionality**
   - Click "Cancel" on a booking
   - Confirm cancellation
   - Verify status changed to "cancelled"
   - Verify "Edit" and "Cancel" buttons are disabled

5. **Test Validation**
   - Try invalid phone number (< 10 digits)
   - Try past date
   - Try invalid email
   - Verify error messages appear

## Troubleshooting

### Bookings not saving
- Check server is running on port 5000
- Verify database tables exist
- Check database connection in server config
- Review server console for error messages

### Cannot retrieve bookings
- Verify phone number is exactly 10 digits
- Check if bookings exist for that phone number
- Verify server API is responding
- Check browser console for network errors

### Edit/Delete not working
- Ensure booking status is not "completed" or "cancelled"
- Check if booking ID in URL matches database
- Verify server error logs
- Try refreshing page

### Styling issues
- Clear browser cache
- Verify BookingManagement.css file exists
- Check CSS import in BookingManagement.jsx
- Verify CSS variables defined in main App.css

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── BookingForm.jsx (updated with DB save)
│   │   └── BookingConfirmation.jsx
│   ├── pages/
│   │   ├── BookingManagement.jsx (NEW)
│   │   ├── Home.jsx (has BookingForm)
│   │   └── ...
│   ├── styles/
│   │   └── BookingManagement.css (NEW)
│   ├── App.js (updated with route)
│   └── ...
├── ...

server/
├── controllers/
│   ├── bookingController.js (NEW)
│   └── ...
├── routes/
│   ├── bookingRoutes.js (NEW)
│   └── ...
├── server.js (updated with booking routes)
└── ...

database/
└── schema.sql (updated with bookings table)
```

## Performance Optimization

1. **Database Indexes**
   - Phone number index for fast lookups
   - Booking ID index for unique identification
   - Status index for filtering

2. **Frontend Optimization**
   - Booking list loaded on demand (after phone login)
   - Modals not rendered until needed
   - Minimal re-renders with state management

3. **API Optimization**
   - Single query to retrieve all bookings by phone
   - Only necessary fields in response
   - Error handling prevents unnecessary database hits

## Deployment Checklist

- [ ] Database schema updated with bookings table
- [ ] Backend API endpoints tested
- [ ] Frontend components integrated and tested
- [ ] Navigation links added to Header
- [ ] CSS styling applied correctly
- [ ] API base URL updated for production
- [ ] Error handling verified
- [ ] Mobile responsiveness tested
- [ ] Database backups configured
- [ ] Server logging configured
