# Admin Panel Setup Guide

## Overview
The admin panel for Sewanagala Sugar Factory Tour Booking System provides:
- 🔐 Secure authentication with JWT tokens
- 📊 Dashboard with booking statistics
- 📋 Booking management (approve, reject, reschedule)
- 📅 Calendar view (planned)
- ⏱️ Tour slots management (planned)
- 📈 Reports & analytics (planned)

## Default Admin Credentials

**Email:** `admin@sewanagala.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

## Environment Variables

The following environment variables are required in `server/.env`:

```env
# Admin Configuration
ADMIN_EMAIL=admin@sewanagala.com
ADMIN_PASSWORD_HASH=$2b$10$8qM4P0K7L9.J3X5Z1Q6W9uYkR2H8mV4pT5zD9cF3nL0w2X7b1s9A
JWT_SECRET=sewanagala_jwt_secret_key_2024_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sewanagala_tour
```

### Generating New Admin Password

If you need to change the admin password, follow these steps:

1. Open Node.js or create a small script:
```javascript
const bcrypt = require('bcryptjs');

// Replace 'your_new_password' with your desired password
bcrypt.hash('your_new_password', 10, (err, hash) => {
  if (err) console.error(err);
  console.log('Add this to .env file:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
```

2. Run the script to generate the hash
3. Copy the hash to `ADMIN_PASSWORD_HASH` in `.env`

### Generating New JWT Secret

Generate a random JWT secret for production:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the result to `JWT_SECRET` in `.env`

## Admin Routes

### Public Routes (No Authentication Required)
- `POST /api/admin/login` - Admin login with email/password
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify-token` - Verify JWT token validity

### Protected Routes (Requires Admin JWT Token)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/bookings` - List all bookings with filters
- `GET /api/admin/bookings/:id` - Get single booking details
- `POST /api/admin/bookings/:id/approve` - Approve a booking
- `POST /api/admin/bookings/:id/reject` - Reject a booking
- `PUT /api/admin/bookings/:id/reschedule` - Reschedule a booking
- `GET /api/admin/bookings/export/csv` - Export bookings to CSV

## Admin Panel Pages

### 1. Admin Login (`/admin/login`)
- Email and password authentication
- JWT token stored in localStorage
- Redirects to dashboard on successful login
- Error messages for invalid credentials

### 2. Admin Dashboard (`/admin/dashboard`)
- 📊 Statistics cards:
  - Pending Bookings
  - Approved Bookings
  - Cancelled Bookings
  - Today's Visits
  - Total Bookings
- 🔗 Quick action links to other admin modules
- 📢 Recent activity notifications
- 🚪 Logout button

### 3. Booking Management (`/admin/bookings`)
- 🔍 Search by name, email, or phone
- 📅 Filter by date
- 📊 Filter by status (pending, confirmed, cancelled)
- ✅ Approve pending bookings
- ❌ Reject bookings
- 📅 Reschedule bookings to different dates
- 👁️ View booking details
- 📥 Download bookings as CSV

## Making API Requests to Protected Routes

Include the JWT token in the Authorization header:

```javascript
const token = localStorage.getItem('adminToken');

fetch('/api/admin/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## Dashboard Statistics

The dashboard displays 5 key metrics:

1. **Pending Bookings** (🕐 Awaiting approval)
   - Count of bookings with status = 'pending'

2. **Approved Bookings** (✅ Confirmed)
   - Count of bookings with status = 'confirmed'

3. **Cancelled Bookings** (❌ Rejected/Cancelled)
   - Count of bookings with status = 'cancelled'

4. **Today's Visits** (📅 Scheduled for today)
   - Count of confirmed bookings for today's date

5. **Total Bookings** (📈 All time)
   - Total count of all bookings

## Booking Statuses

- **pending** - Awaiting admin approval
- **confirmed** - Approved by admin (customer will be notified)
- **cancelled** - Rejected by admin or cancelled by customer

## Token Management

- Tokens expire after **24 hours**
- Tokens are stored in `localStorage.adminToken`
- Tokens are sent in Authorization header: `Bearer {token}`
- Invalid/expired tokens automatically redirect to login

## Security Features

✅ **Implemented:**
- JWT authentication for protected routes
- Bcryptjs password hashing
- Environment variables for sensitive data
- Parameterized database queries (SQL injection prevention)
- CORS protection
- Token expiration (24 hours)

🔄 **Recommended for Production:**
- Rate limiting on login endpoint (prevent brute force)
- CSRF tokens
- HTTPS enforcement
- Multiple admin users with roles
- Google Authenticator 2FA
- Admin activity logging
- Failed login attempt logging
- Email notifications for important actions

## Troubleshooting

### "Invalid email or password" on login
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` in `.env`
- Ensure bcrypt hash is generated correctly
- Check that password is not case-sensitive if needed

### "Token expired" error
- Clear localStorage and login again
- Verify JWT_SECRET hasn't changed
- Check that server time is synchronized

### 401 Unauthorized on protected routes
- Verify token is stored in localStorage
- Check that Authorization header format is: `Bearer {token}`
- Ensure token hasn't expired (24-hour expiration)
- Verify ProtectedRoute component is wrapping admin pages

### CORS errors
- Verify CORS is enabled in server: `app.use(cors());`
- Check that frontend and backend are communicating correctly
- Verify API URLs match between frontend and backend

## Next Features (Planned)

- 📅 Calendar View - Monthly bookings visualization
- ⏱️ Tour Slots Management - Configure available time slots
- 📈 Reports & Analytics - Bookings trends and statistics
- 📧 Email Notifications - Approve/reject email alerts
- 🔔 Notification System - In-app badges and alerts
- 👥 Admin User Management - Multiple admin accounts with roles

## Production Checklist

Before deploying to production:

- [ ] Change `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`
- [ ] Generate new `JWT_SECRET` using crypto.randomBytes
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Implement rate limiting on login endpoint
- [ ] Set up email notifications
- [ ] Enable 2FA or Google Authenticator
- [ ] Implement admin activity logging
- [ ] Set up automated backups
- [ ] Configure CORS with specific origins
- [ ] Test all admin functionalities
- [ ] Document admin procedures for team

## File Structure

```
server/
  ├── controllers/
  │   └── adminController.js       # Admin business logic
  ├── middleware/
  │   └── adminAuth.js             # JWT verification middleware
  ├── routes/
  │   └── adminRoutes.js           # Admin API endpoints
  └── .env                         # Environment variables

client/
  ├── src/
  │   ├── components/
  │   │   └── ProtectedRoute.jsx   # Route protection wrapper
  │   ├── pages/
  │   │   ├── AdminLogin.jsx       # Login page
  │   │   ├── AdminDashboard.jsx   # Dashboard
  │   │   └── AdminBookings.jsx    # Booking management
  │   ├── styles/
  │   │   ├── AdminLogin.css       # Login styling
  │   │   ├── AdminDashboard.css   # Dashboard styling
  │   │   └── AdminBookings.css    # Booking management styling
  │   └── App.js                   # Routes configuration
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Review browser console for error messages
4. Check server logs for API errors
5. Ensure database connection is working

---

**Last Updated:** 2024  
**Version:** 1.0.0
