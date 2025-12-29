# Admin Panel Testing Checklist

## Pre-Testing Setup

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database (MySQL) is running and accessible
- [ ] .env file exists with proper credentials
- [ ] No errors in browser console (F12)
- [ ] No errors in server terminal

---

## 1️⃣ Authentication Testing

### Login Page Tests
- [ ] Navigate to http://localhost:3000/admin/login
- [ ] Page displays login form
- [ ] Email input field is functional
- [ ] Password input field is functional
- [ ] Login button is clickable
- [ ] "Remember me" or similar features work (if applicable)

### Valid Credentials
- [ ] Login with email: `admin@sewanagala.com`
- [ ] Login with password: `admin123`
- [ ] Click login button
- [ ] Success message appears (if implemented)
- [ ] Redirected to `/admin/dashboard`
- [ ] adminToken saved in localStorage
- [ ] adminEmail saved in localStorage

### Invalid Credentials
- [ ] Try wrong email → Show error "Invalid email or password"
- [ ] Try wrong password → Show error "Invalid email or password"
- [ ] Try empty fields → Show error "Required fields"
- [ ] Stay on login page (no redirect)

### Session Persistence
- [ ] Login successfully
- [ ] Close browser tab
- [ ] Reopen admin login page
- [ ] Should redirect to dashboard (token still valid)
- [ ] Not ask for login again

### Logout
- [ ] Click logout button on dashboard
- [ ] Token removed from localStorage
- [ ] Redirected to `/admin/login`
- [ ] Can't access admin pages without logging in again

---

## 2️⃣ Protected Routes Testing

### Route Protection
- [ ] Try accessing `/admin/dashboard` without login
- [ ] Should redirect to `/admin/login`
- [ ] Try accessing `/admin/bookings` without login
- [ ] Should redirect to `/admin/login`

### Route Access After Login
- [ ] Login successfully
- [ ] Can access `/admin/dashboard`
- [ ] Can access `/admin/bookings`
- [ ] Can access other admin routes

### Token Expiration (24 hours)
- [ ] Login successfully
- [ ] Wait 24+ hours (or simulate by editing token)
- [ ] Try accessing protected route
- [ ] Should get 401 error
- [ ] Should redirect to login

---

## 3️⃣ Dashboard Testing

### Page Load
- [ ] Navigate to `/admin/dashboard`
- [ ] Page loads without errors
- [ ] Dashboard header visible
- [ ] All stat cards display

### Statistics Display
- [ ] **Pending Bookings** card shows number
- [ ] **Approved Bookings** card shows number
- [ ] **Cancelled Bookings** card shows number
- [ ] **Today's Visits** card shows number
- [ ] **Total Bookings** card shows number

### Stat Card Calculations
- [ ] Pending count = actual pending bookings in DB
- [ ] Approved count = actual confirmed bookings in DB
- [ ] Cancelled count = actual cancelled bookings in DB
- [ ] Today count = confirmed bookings for today's date only
- [ ] Total count = sum of all bookings

### Quick Action Cards
- [ ] "Manage Bookings" link visible
- [ ] "Manage Bookings" link clickable → goes to `/admin/bookings`
- [ ] "Calendar View" link visible (even if grayed out)
- [ ] "Tour Slots" link visible (even if grayed out)
- [ ] "Reports" link visible (even if grayed out)

### Notifications Section
- [ ] Recent activity section displays
- [ ] Shows notifications (or "No recent activity")
- [ ] Notification styling is correct

### Logout Button
- [ ] Logout button visible
- [ ] Logout button clickable
- [ ] Clicking logout clears tokens
- [ ] Redirects to login page

### Styling
- [ ] Green gradient header looks professional
- [ ] Stat cards have proper borders and colors
- [ ] Responsive design works on mobile (1024px, 768px, 480px)
- [ ] Hover effects work on cards
- [ ] Text is readable
- [ ] No overlapping elements

---

## 4️⃣ Booking Management Testing

### Page Load
- [ ] Navigate to `/admin/bookings`
- [ ] Page loads without errors
- [ ] Bookings table displays
- [ ] Filter section visible

### Search Functionality
- [ ] Search by customer name
- [ ] Search by customer email
- [ ] Search by customer phone
- [ ] Results filter in real-time
- [ ] Search with empty string shows all

### Status Filter
- [ ] Filter by "all" shows all bookings
- [ ] Filter by "pending" shows only pending
- [ ] Filter by "approved" shows only confirmed
- [ ] Filter by "cancelled" shows only cancelled

### Date Filter
- [ ] Click date picker
- [ ] Select date
- [ ] Shows bookings for that date
- [ ] Selecting past date works
- [ ] Selecting future date works

### Reset Filters
- [ ] Click "Reset Filters" button
- [ ] All filters cleared
- [ ] Search box empty
- [ ] Status filter = "all"
- [ ] Date filter empty
- [ ] All bookings displayed again

### Table Display
- [ ] Table has columns: ID, Name, Contact, Visitors, Date, Time, Status, Actions
- [ ] All bookings display with correct data
- [ ] Booking IDs display in monospace font
- [ ] Dates formatted correctly (YYYY-MM-DD or similar)
- [ ] Times formatted correctly (HH:MM AM/PM)
- [ ] Contact info shows email and phone on separate lines

### Status Badges
- [ ] Pending bookings show with orange/yellow badge
- [ ] Approved bookings show with green badge
- [ ] Cancelled bookings show with red badge
- [ ] Badge styling matches design mockups

### Action Buttons
- [ ] Pending bookings show "Approve" and "Reject" buttons
- [ ] Approved bookings show "Reschedule" button
- [ ] All bookings show "View" button
- [ ] Buttons are colored appropriately

---

## 5️⃣ Approve Booking Testing

### Modal Display
- [ ] Click Approve button on pending booking
- [ ] Modal/dialog appears
- [ ] Modal shows booking summary
- [ ] Modal shows "Confirm" and "Cancel" buttons
- [ ] Click outside modal doesn't confirm

### Approve Action
- [ ] Click "Confirm" button in modal
- [ ] Modal closes
- [ ] API request sent (check network tab)
- [ ] Booking status changes to "confirmed" (green badge)
- [ ] Booking moves from pending filter
- [ ] Success message displays

### Cancel Approval
- [ ] Click Approve button
- [ ] Modal appears
- [ ] Click "Cancel" button
- [ ] Modal closes without making request
- [ ] Booking unchanged

### Error Handling
- [ ] If API error occurs, show error message
- [ ] Booking status doesn't change on error
- [ ] User can retry

---

## 6️⃣ Reject Booking Testing

### Modal Display
- [ ] Click Reject button on pending booking
- [ ] Modal appears
- [ ] Shows booking summary
- [ ] Shows "Confirm" and "Cancel" buttons

### Reject Action
- [ ] Click "Confirm" in modal
- [ ] Modal closes
- [ ] API request sent
- [ ] Booking status changes to "cancelled" (red badge)
- [ ] Booking disappears from pending filter
- [ ] Success message displays

### Cancel Rejection
- [ ] Click Reject button
- [ ] Modal appears
- [ ] Click "Cancel"
- [ ] Modal closes
- [ ] Booking unchanged

---

## 7️⃣ Reschedule Booking Testing

### Modal Display
- [ ] Click Reschedule on approved booking
- [ ] Modal appears with form
- [ ] Shows current booking details
- [ ] Shows date picker
- [ ] Shows time picker
- [ ] Shows "Reschedule" and "Cancel" buttons

### Select New Date
- [ ] Click date picker
- [ ] Calendar appears
- [ ] Select new date
- [ ] Date displays in form

### Select New Time
- [ ] Click time picker
- [ ] Time selector appears
- [ ] Select new time
- [ ] Time displays in form

### Reschedule Action
- [ ] Fill in new date and time
- [ ] Click "Reschedule" button
- [ ] Modal closes
- [ ] API request sent with new date/time
- [ ] Booking table updates with new date/time
- [ ] Success message displays

### Cancel Reschedule
- [ ] Click Reschedule
- [ ] Modal appears
- [ ] Click "Cancel"
- [ ] Modal closes without updating
- [ ] Booking unchanged

---

## 8️⃣ View Booking Details Testing

### Modal Display
- [ ] Click View button on any booking
- [ ] Modal appears with all booking details
- [ ] Shows: ID, Name, Email, Phone, Visitors, Date, Time, Status
- [ ] Shows "Close" button

### Close Modal
- [ ] Click "Close" button
- [ ] Modal closes
- [ ] Returns to bookings list

### Mobile Responsiveness
- [ ] Modal displays properly on mobile
- [ ] Text is readable
- [ ] Buttons are accessible

---

## 9️⃣ CSV Export Testing

### Export Button
- [ ] CSV export button visible
- [ ] Button is clickable

### Export Process
- [ ] Click export button
- [ ] File download starts
- [ ] File downloads as .csv
- [ ] File opens in Excel/Google Sheets

### Export Content
- [ ] CSV contains all visible bookings
- [ ] All columns included
- [ ] Data is accurate
- [ ] Formatting is correct

---

## 🔟 Responsive Design Testing

### Desktop (1024px+)
- [ ] All elements display properly
- [ ] Stats in 2-column grid
- [ ] Bookings table fully visible
- [ ] No horizontal scrolling needed

### Tablet (768px - 1023px)
- [ ] Layout adjusts to tablet size
- [ ] Stats in 1-column grid
- [ ] Bookings table adjusts
- [ ] Mobile-friendly navigation

### Mobile (480px - 767px)
- [ ] Buttons stack vertically
- [ ] Table becomes single column
- [ ] Text sizes reduced
- [ ] All functionality accessible
- [ ] No overlapping elements

---

## 1️⃣1️⃣ API Communication Testing

### Network Tab (Browser DevTools)
- [ ] All requests go to http://localhost:5000
- [ ] Authorization header present in requests
- [ ] Authorization header format: "Bearer {token}"
- [ ] POST requests have correct Content-Type
- [ ] Requests return 200/201/400/401 as appropriate

### Error Responses
- [ ] Invalid token → 401 error
- [ ] Server error → 500 error
- [ ] Not found → 404 error
- [ ] Validation error → 400 error with message

---

## 1️⃣2️⃣ Data Accuracy Testing

### Database Consistency
- [ ] Approving booking updates DB status to "confirmed"
- [ ] Rejecting booking updates DB status to "cancelled"
- [ ] Rescheduling updates visit_date and visit_time in DB
- [ ] All changes persist after page refresh
- [ ] Dashboard stats match DB counts

### Data Synchronization
- [ ] After approval, booking appears in approved filter
- [ ] After rejection, booking appears in cancelled filter
- [ ] After reschedule, booking shows new date/time
- [ ] Multiple admins see same data

---

## 1️⃣3️⃣ Performance Testing

### Page Load Speed
- [ ] Dashboard loads within 2 seconds
- [ ] Bookings page loads within 3 seconds
- [ ] Pagination works (shows 50 per page)
- [ ] Filters apply without long delays

### Large Dataset
- [ ] System handles 1000+ bookings
- [ ] No performance degradation
- [ ] Filtering still responsive

---

## 1️⃣4️⃣ Browser Compatibility

- [ ] Chrome ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅

---

## 1️⃣5️⃣ Security Testing

### Token Security
- [ ] Token not visible in URL
- [ ] Token stored only in localStorage (not cookies, unless intended)
- [ ] Token not logged to console
- [ ] Token changes on logout

### Authentication
- [ ] Can't access admin without valid token
- [ ] Can't bypass login page
- [ ] Invalid tokens rejected

### CORS
- [ ] API requests from http://localhost:3000 allowed
- [ ] No CORS errors in console

---

## 1️⃣6️⃣ Error Handling Testing

### Network Errors
- [ ] Disconnect backend server
- [ ] Try to fetch bookings
- [ ] Show appropriate error message
- [ ] User can retry

### Invalid Data
- [ ] Send malformed request
- [ ] Backend handles gracefully
- [ ] Error message displayed

### Edge Cases
- [ ] No bookings in database
- [ ] Dashboard shows 0 for all stats
- [ ] Table shows "No bookings found"
- [ ] All filters still work

---

## 1️⃣7️⃣ Documentation Testing

- [ ] ADMIN_SETUP.md is clear and complete
- [ ] ADMIN_QUICK_START.md helps first-time users
- [ ] ADMIN_ARCHITECTURE.md explains system design
- [ ] ADMIN_IMPLEMENTATION.md lists all features
- [ ] All code comments are clear
- [ ] No broken links in documentation

---

## Sign-Off

After all tests pass:

- [ ] Date tested: _______________
- [ ] Tester name: _______________
- [ ] Backend version: _______________
- [ ] Frontend version: _______________
- [ ] Database: _______________
- [ ] Issues found: _______________
- [ ] All issues resolved: [ ] Yes [ ] No
- [ ] Ready for production: [ ] Yes [ ] No

---

## Known Limitations (As of v1.0)

- ⚠️ Single admin user only (multi-admin planned)
- ⚠️ No 2FA/MFA (planned for v2.0)
- ⚠️ No rate limiting on login (recommended for production)
- ⚠️ Calendar and Slots pages not yet implemented
- ⚠️ Email notifications not configured
- ⚠️ No activity logging yet

---

## Test Report Template

```markdown
# Admin Panel Test Report - [Date]

## Test Summary
- Total Tests: 100+
- Passed: __
- Failed: __
- Skipped: __
- Success Rate: __%

## Test Environment
- Browser: 
- OS: 
- Backend: Running
- Frontend: Running
- Database: Connected

## Issues Found
1. [Issue #1]
   - Severity: High/Medium/Low
   - Description: 
   - Reproduction Steps:
   - Solution:

## Recommendations
- 
- 
- 

## Sign-Off
- Tested by: 
- Approved by: 
- Date: 
```

---

**Testing Version:** 1.0.0  
**Last Updated:** 2024

All tests should be performed before pushing to production!
