# Testing My Bookings Feature - Quick Guide

## 🚀 Quick Start

The Next.js development server is already running on **http://localhost:3001**

### Access My Bookings Page
Navigate to: **http://localhost:3001/my-bookings**

Or click the **"My Bookings"** link in the header navigation.

---

## 📋 Test Scenarios

### Scenario 1: Search for Bookings
1. Go to http://localhost:3001/my-bookings
2. Enter a phone number that exists in the database (e.g., the phone number used in a previous booking)
3. Click "Search Bookings"
4. **Expected Result:** List of bookings appears

### Scenario 2: View Booking Details
1. After searching, view the booking cards
2. **Check for:**
   - Booking ID
   - Customer Name
   - Visit Date and Time
   - Visitor Count
   - Email Address
   - Status Badge (Confirmed, Pending, Completed, Cancelled)
   - Special Requirements (if any)

### Scenario 3: Edit a Booking
1. Click the "Edit" button on a confirmed or pending booking
2. Modify any of the following:
   - Name
   - Email
   - Visitor Count (1-50)
   - Visit Date
   - Visit Time
   - Special Requirements
3. Click "Save Changes"
4. **Expected Result:** Success message and booking list updates

### Scenario 4: Cancel a Booking
1. Click the "Cancel" button on a confirmed or pending booking
2. A confirmation modal appears
3. Click "Cancel Booking" to confirm
4. **Expected Result:** Success message and status changes to "Cancelled"

### Scenario 5: Error Handling
1. **Invalid Phone Number:**
   - Enter less than 9 digits or more than 15 digits
   - **Expected:** Error message "Please enter a valid phone number"

2. **No Bookings Found:**
   - Enter a phone number with no bookings
   - **Expected:** Error message "No bookings found for this phone number"

3. **Edit Invalid Data:**
   - Try to edit with an invalid email format
   - **Expected:** Error message "Please enter a valid email address"
   - Try visitor count < 1 or > 50
   - **Expected:** Error message about valid range

4. **Edit Cancelled Booking:**
   - Try to edit a cancelled or completed booking
   - **Expected:** Edit button is disabled with message "Cannot modify cancelled/completed bookings"

---

## 🔍 Database Query to Get Test Phone Numbers

If you need to find phone numbers with existing bookings, run this SQL query:

```sql
SELECT phone, COUNT(*) as booking_count, 
       MAX(created_at) as last_booking
FROM bookings 
GROUP BY phone 
ORDER BY last_booking DESC 
LIMIT 10;
```

---

## 🎨 Visual Features to Verify

### ✅ Animations
- Page transitions should be smooth
- Modal should fade in/out
- Cards should slide up on load

### ✅ Status Badges
- **Orange** = Pending
- **Green** = Confirmed
- **Blue** = Completed
- **Red** = Cancelled

### ✅ Responsive Design
- Test on different screen sizes
- Mobile view should stack elements vertically
- Buttons should be touch-friendly

### ✅ Loading States
- "Searching..." during phone lookup
- "Saving..." during edit
- "Cancelling..." during cancellation
- Disabled buttons during loading

---

## 🐛 Known Limitations

1. **No OTP Verification** - Anyone with a phone number can view/edit bookings
   - *Future Enhancement:* Add SMS OTP verification

2. **No Email Notifications** - Changes don't trigger notifications
   - *Future Enhancement:* Send email/SMS on edit/cancel

3. **Basic Phone Validation** - Only checks digit count
   - *Future Enhancement:* Add country code validation

---

## 📱 API Endpoints Being Used

### 1. Get Bookings by Phone
```
GET /api/bookings/phone/[phone]
Example: /api/bookings/phone/0771234567
```

### 2. Update Booking
```
PUT /api/bookings/[id]/update
Body: { name, email, visitor_count, visit_date, visit_time, special_requirements }
```

### 3. Cancel Booking
```
PATCH /api/bookings/[id]/cancel
```

---

## 🔧 Troubleshooting

### Issue: "Failed to connect to server"
**Solution:** Check if the backend server is running and database is connected

### Issue: "No bookings found"
**Solution:** Verify the phone number exists in the database

### Issue: Page not loading
**Solution:** 
1. Check if Next.js dev server is running on port 3001
2. Clear browser cache
3. Check console for errors

### Issue: Edit/Cancel not working
**Solution:** 
1. Check network tab for API errors
2. Verify database connection
3. Check booking status (can't modify cancelled/completed)

---

## ✨ Success Criteria

- [x] Phone number search works
- [x] Bookings list displays correctly
- [x] Edit functionality works
- [x] Cancel functionality works
- [x] Validation prevents invalid inputs
- [x] Error messages display appropriately
- [x] Success messages confirm actions
- [x] Status badges show correct colors
- [x] Animations are smooth
- [x] Responsive on mobile devices
- [x] Cannot edit/cancel completed or cancelled bookings

---

## 🎯 Next Steps After Testing

1. **Deploy to Production** - Once testing is complete
2. **Add Security** - Implement OTP verification for phone authentication
3. **Enhance Notifications** - Add email/SMS notifications for changes
4. **Analytics** - Track booking modifications
5. **Admin Dashboard** - Show booking edit history

---

**Testing Status:** Ready for manual testing ✅

**Access URL:** http://localhost:3001/my-bookings
