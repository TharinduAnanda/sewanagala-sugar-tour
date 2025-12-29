# Admin Panel Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘

                          Frontend (React)
                          ═══════════════════
                    ┌──────────────────────────┐
                    │   App.js (Routes)        │
                    │  - Public Routes         │
                    │  - Protected Routes      │
                    └──────┬───────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    AdminLogin.jsx    ProtectedRoute     Admin Pages
    (Public)          (Wrapper)          (Protected)
        │                                    │
        │              ┌──────────────────────┤
        │              │                      │
        ▼              ▼                      ▼
    Login Form    Token Check      AdminDashboard
    - Email       - Validate          - Stats
    - Password    - Redirect         - Quick Links
    - Submit      - Authorize        - Notifications
        │                                    │
        └────────────────┬───────────────────┘
                         │
                   Browser Storage
                   (localStorage)
                    │
            ┌───────────────────────┐
            │   adminToken          │
            │   adminEmail          │
            └───────────────────────┘
                     │
                     ▼
              API Requests
              (with Bearer Token)
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    Backend (Express.js)
    ═══════════════════════════════════
    
    ┌─────────────────────────────────┐
    │    Admin Routes                 │
    │  (/api/admin/...)               │
    └────────────┬────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
Public Routes          Protected Routes
- /login              (with JWT verification)
- /logout             - /dashboard
- /verify-token       - /bookings
                      - /bookings/:id/approve
                      - /bookings/:id/reject
                      - /bookings/:id/reschedule
                      - /bookings/export/csv
    │                         │
    └────────────┬────────────┘
                 │
                 ▼
         Admin Middleware
         (adminAuth.js)
         - Extract token
         - Verify JWT
         - Set req.admin
         - Allow/Deny access
                 │
                 ▼
         Admin Controller
         (adminController.js)
         - Business Logic
         - Database Queries
         - Response Formatting
                 │
                 ▼
             Database
             (MySQL)
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   bookings     users
   table        table
   (tour        (customer
    bookings)   accounts)
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN AUTHENTICATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ▼
Admin navigates to /admin/login
  │
  ▼
┌──────────────────────────┐
│  AdminLogin Component    │
│  Displays form with:     │
│  - Email input           │
│  - Password input        │
│  - Login button          │
└──────────────────────────┘
  │ (User enters credentials)
  ▼
POST /api/admin/login
{
  "email": "admin@sewanagala.com",
  "password": "admin123"
}
  │
  ▼
┌──────────────────────────┐
│ adminController.js       │
│ .adminLogin()            │
│                          │
│ 1. Validate input        │
│ 2. Check email match     │
│ 3. Compare password      │
│    (bcrypt.compare)      │
│ 4. Generate JWT token    │
└──────────────────────────┘
  │
  ├─── If invalid ──→ 401 Error Response
  │                  "Invalid email or password"
  │                  │
  │                  ▼
  │             Show error on page
  │             Remain on login page
  │
  └─── If valid ──→ 200 Success Response
                    {
                      "token": "eyJhbGc...",
                      "email": "admin@sewanagala.com"
                    }
                    │
                    ▼
              Store in localStorage:
              - adminToken
              - adminEmail
              │
              ▼
         Redirect to /admin/dashboard
              │
              ▼
         AdminDashboard loads
         - Reads token from localStorage
         - Sends with Bearer header
         - Displays dashboard
              │
              ▼
            SUCCESS ✅

---

Logout Flow:
         │
         ▼
    Click Logout
         │
         ▼
    POST /api/admin/logout
         │
         ▼
    Clear localStorage
    - Remove adminToken
    - Remove adminEmail
         │
         ▼
    Redirect to /admin/login
         │
         ▼
    SUCCESS ✅
```

---

## Protected Route Access Flow

```
┌──────────────────────────────────────────────────────────────────┐
│               PROTECTED ROUTE ACCESS FLOW                         │
└──────────────────────────────────────────────────────────────────┘

User navigates to /admin/bookings
         │
         ▼
┌─────────────────────────┐
│ ProtectedRoute Component│
│ Checks localStorage     │
│ for adminToken          │
└─────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
  Token       No Token
  Found       Found
    │          │
    ▼          ▼
 ALLOW      REDIRECT
 Render     to Login
 Component  Page
    │          │
    ▼          ▼
<AdminBookings/>   /admin/login
    │
    ▼
Component loads
Fetch /api/admin/bookings
with Authorization header:
"Bearer {token}"
    │
    ▼
┌──────────────────────────────────┐
│ Server receives request           │
│ adminAuth middleware checks:      │
│ 1. Has Authorization header?      │
│ 2. Starts with "Bearer "?         │
│ 3. Token is valid JWT?            │
│ 4. Token not expired?             │
└──────────────────────────────────┘
    │
    ├─── If invalid ──→ 401 Error
    │                  Redirect to login
    │
    └─── If valid ──→ Continue to controller
                      Execute business logic
                      Return data
                      │
                      ▼
                 Component receives data
                 Display bookings
                 │
                 ▼
                SUCCESS ✅
```

---

## Booking Approval Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│              BOOKING APPROVAL WORKFLOW                            │
└──────────────────────────────────────────────────────────────────┘

Initial State: Booking with status = "pending"
              │
              ▼
Admin clicks ✅ Approve button
              │
              ▼
┌─────────────────────────┐
│ Modal appears:          │
│ - Show booking summary  │
│ - Confirm button        │
│ - Cancel button         │
└─────────────────────────┘
              │
              ├─── Cancel ──→ Close modal, no change
              │
              └─── Confirm ──→ Proceed
                               │
                               ▼
                      POST /api/admin/bookings/{id}/approve
                      with Authorization header
                               │
                               ▼
                      ┌────────────────────────────┐
                      │ Server:                    │
                      │ 1. Verify admin token      │
                      │ 2. Get booking by ID       │
                      │ 3. Check if pending        │
                      │ 4. Update status →         │
                      │    "confirmed"             │
                      │ 5. Return success          │
                      └────────────────────────────┘
                               │
                               ▼
                      ✅ Success Response:
                      { "success": true }
                               │
                               ▼
                      Frontend updates state:
                      - Remove from modal
                      - Refresh booking list
                      - Show success message
                      - Booking now shows with
                        "confirmed" status (green)
                               │
                               ▼
                      SUCCESS ✅
                      Customer receives notification
                      (email/SMS - if implemented)
```

---

## Database Query Flow

```
┌──────────────────────────────────────────────────────────────────┐
│             DATABASE QUERY FLOW                                   │
└──────────────────────────────────────────────────────────────────┘

GET /api/admin/bookings?status=pending&search=john
         │
         ▼
┌──────────────────────────────┐
│ getBookingsData() function   │
│ Builds query with:           │
│ - status = "pending"         │
│ - name LIKE "%john%"         │
│ - email LIKE "%john%"        │
│ - phone LIKE "%john%"        │
│ - LIMIT 50                   │
└──────────────────────────────┘
         │
         ▼
SQL Query executed:
┌──────────────────────────────────────────┐
│ SELECT * FROM bookings                   │
│ WHERE status = 'pending'                 │
│ AND (name LIKE '%john%' OR               │
│      email LIKE '%john%' OR              │
│      phone LIKE '%john%')                │
│ LIMIT 50;                                │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Results returned:            │
│ Array of booking objects     │
│ [                            │
│   {                          │
│     id: 1,                   │
│     name: "John Doe",        │
│     email: "john@email.com", │
│     phone: "+94...",         │
│     visitor_count: 4,        │
│     visit_date: "2024-12-15",│
│     visit_time: "09:00 AM",  │
│     status: "pending",       │
│     ...                      │
│   },                         │
│   ...                        │
│ ]                            │
└──────────────────────────────┘
         │
         ▼
JSON Response sent to frontend
         │
         ▼
AdminBookings component receives data
         │
         ▼
Render table with results
┌──────────────────────────────┐
│ Booking ID | Name | Status   │
│ 1          | John | pending  │
│ ...        | ...  | ...      │
└──────────────────────────────┘
         │
         ▼
Display complete ✅
```

---

## API Request Example

```
Example: Approve a booking

Request:
┌──────────────────────────────────────────┐
│ POST /api/admin/bookings/123/approve     │
│                                          │
│ Headers:                                 │
│ - Content-Type: application/json         │
│ - Authorization: Bearer eyJhbGci...      │
│                                          │
│ Body: {}                                 │
└──────────────────────────────────────────┘

Response Success (200):
┌──────────────────────────────────────────┐
│ {                                        │
│   "success": true,                       │
│   "message": "Booking approved",         │
│   "booking": {                           │
│     "id": 123,                           │
│     "status": "confirmed",               │
│     "updated_at": "2024-12-01..."        │
│   }                                      │
│ }                                        │
└──────────────────────────────────────────┘

Response Error (401):
┌──────────────────────────────────────────┐
│ {                                        │
│   "success": false,                      │
│   "error": "Unauthorized"                │
│ }                                        │
└──────────────────────────────────────────┘
```

---

## Component State Flow

```
AdminBookings Component State:

bookings: []          ← Array of all bookings
loading: false        ← Show/hide spinner
error: ""             ← Error message display
selectedBooking: {}   ← Current booking being edited
showModal: false      ← Show/hide modal
modalType: ""         ← Which modal? (approve/reject/etc)
filters: {            ← Current filter values
  status: "",
  search: "",
  date: ""
}
rescheduleData: {     ← New date/time for reschedule
  visit_date: "",
  visit_time: ""
}

State Updates:
1. User selects filters → setFilters() → useEffect fires
2. useEffect fetches data → setLoading(true)
3. API returns results → setBookings() → setLoading(false)
4. User clicks Approve → setSelectedBooking() → setShowModal(true)
5. User confirms → POST request → setFilters() (refresh)
6. Fresh data arrives → Update bookings state
7. Modal closes → setShowModal(false)
```

---

## File Dependencies

```
App.js (Router)
  │
  ├── AdminLogin.jsx
  │   └── AdminLogin.css
  │       └── POST /api/admin/login
  │
  ├── ProtectedRoute.jsx
  │   └── localStorage (adminToken)
  │
  ├── AdminDashboard.jsx (Protected)
  │   ├── AdminDashboard.css
  │   └── GET /api/admin/dashboard
  │
  └── AdminBookings.jsx (Protected)
      ├── AdminBookings.css
      ├── GET /api/admin/bookings
      ├── POST /api/admin/bookings/:id/approve
      ├── POST /api/admin/bookings/:id/reject
      ├── PUT /api/admin/bookings/:id/reschedule
      └── GET /api/admin/bookings/export/csv

Backend:
server.js
  ├── adminRoutes.js
  │   ├── adminController.js
  │   │   ├── adminLogin()
  │   │   ├── getDashboardStats()
  │   │   ├── getAllBookings()
  │   │   ├── approveBooking()
  │   │   └── rescheduleBooking()
  │   │
  │   └── adminAuth.js (middleware)
  │       └── authenticateAdmin()
  │
  └── db.js (database connection)
      └── MySQL bookings table
```

---

## Token Lifecycle

```
┌─────────────────────────────────────────┐
│        JWT TOKEN LIFECYCLE              │
└─────────────────────────────────────────┘

1. GENERATION (Login)
   ├── Email + password verified
   ├── jwt.sign() creates token
   ├── Payload: { email, role, iat }
   ├── Expires: 24 hours
   └── Sent to frontend

2. STORAGE (Frontend)
   ├── localStorage.setItem('adminToken', token)
   ├── Stored until logout
   └── Available in browser session

3. USAGE (API Requests)
   ├── Include in Authorization header
   ├── Format: "Bearer {token}"
   ├── Sent with every protected route request
   └── Server extracts and verifies

4. VERIFICATION (Backend)
   ├── adminAuth middleware checks
   ├── jwt.verify() validates signature
   ├── Checks expiration time
   ├── Sets req.admin if valid
   └── Denies access if invalid/expired

5. EXPIRATION
   ├── 24 hours after creation
   ├── Becomes invalid after expiration
   ├── Frontend detects 401 error
   ├── Redirects user to login
   └── User must login again

6. INVALIDATION (Logout)
   ├── User clicks logout
   ├── localStorage.removeItem('adminToken')
   ├── Token deleted from browser
   ├── User redirected to login
   └── Backend doesn't need to do anything
      (stateless JWT)
```

---

This architecture ensures:
- ✅ Secure authentication
- ✅ Protected admin routes
- ✅ Proper token management
- ✅ Clean separation of concerns
- ✅ Scalable backend design
- ✅ User-friendly frontend

