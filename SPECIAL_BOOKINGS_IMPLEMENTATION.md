# Special Bookings Implementation Guide

## 🎯 Overview

A complete system for handling special large-group bookings (over 100 visitors per time slot) with admin approval workflow, document uploads, and dual notifications (SMS + Email).

---

## 📊 Database Changes

### 1. Run SQL Schema
Execute the following SQL file to update your database:
```bash
mysql -u root -p sewanagala_tour < database/special_bookings_schema.sql
```

**What it does:**
- ✅ Updates `bookings` table with special booking columns
- ✅ Creates `special_booking_documents` table for file tracking
- ✅ Creates `special_booking_notifications` table for SMS/Email logs
- ✅ Sets all `tour_slots` max_capacity to 100
- ✅ Adds indexes for better performance
- ✅ Creates admin view for pending special bookings

---

## 🏗️ Architecture

### **Normal Booking Flow (≤100 visitors)**
1. User fills booking form
2. Booking auto-confirmed
3. Single SMS + Email sent
4. Appears in admin bookings

### **Special Booking Flow (>100 visitors)**
1. User requests >100 capacity
2. Special form appears with:
   - Capacity input (>100)
   - Detailed reason (min 50 chars)
   - Document upload (PDF/Images via Cloudinary)
3. Booking status: `pending`
4. **2 Notifications sent:**
   - SMS: "Booking pending approval"
   - Email: "Special request received, awaiting review"
5. Admin receives notification
6. Admin reviews:
   - Views all details
   - Checks uploaded documents
   - Approves or Rejects
7. **2 More Notifications sent:**
   - SMS: "Booking approved/rejected"
   - Email: Full confirmation or rejection details

---

## 📁 New Files Created

### **Frontend Components**
1. `src/components/SpecialBookingForm.tsx` - UI for special requests
2. `src/app/admin/special-bookings/page.tsx` - Admin approval interface

### **Backend APIs**
3. `src/app/api/bookings/special/route.ts` - Create special booking
4. `src/app/api/admin/special-bookings/route.ts` - List special bookings
5. `src/app/api/admin/special-bookings/[id]/approve/route.ts` - Approve/Reject
6. `src/app/api/bookings/[id]/documents/route.ts` - Fetch documents

### **Utilities**
7. `src/lib/cloudinaryUpload.ts` - Cloudinary upload functions

### **Database**
8. `database/special_bookings_schema.sql` - Complete database schema

---

## 🔧 Integration Steps

### **Step 1: Update Booking Page**

Add this to your booking form (after group size selection):

```tsx
import SpecialBookingForm from '@/components/SpecialBookingForm'

// In your component
const [isSpecialBooking, setIsSpecialBooking] = useState(false)
const [requestedCapacity, setRequestedCapacity] = useState(0)
const [specialReason, setSpecialReason] = useState('')
const [documents, setDocuments] = useState([])

// Calculate total visitors
const totalVisitors = adults + children

// Check if special booking needed
useEffect(() => {
  setIsSpecialBooking(totalVisitors > 100)
}, [adults, children])

// In your form JSX
{isSpecialBooking && (
  <SpecialBookingForm
    requestedCapacity={totalVisitors}
    onCapacityChange={setRequestedCapacity}
    specialReason={specialReason}
    onReasonChange={setSpecialReason}
    documents={documents}
    onDocumentsChange={setDocuments}
  />
)}

// Update form submission
const handleSubmit = async () => {
  const endpoint = isSpecialBooking ? '/api/bookings/special' : '/api/bookings'
  
  const data = isSpecialBooking ? {
    // existing fields...
    requested_capacity: requestedCapacity,
    special_request_reason: specialReason,
    documents: documents,
  } : {
    // normal booking fields
  }
  
  // Submit to endpoint
}
```

### **Step 2: Add Admin Navigation**

Update admin dashboard to include Special Bookings:

```tsx
// In AdminLayout or dashboard
<Link href="/admin/special-bookings">
  <Button>
    <FaExclamationTriangle className="mr-2" />
    Special Bookings
    {pendingCount > 0 && (
      <Badge className="ml-2">{pendingCount}</Badge>
    )}
  </Button>
</Link>
```

### **Step 3: Configure Cloudinary**

Add to your `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=djy8hclco
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create upload preset in Cloudinary dashboard:
- Preset name: `ml_default`
- Signing mode: Unsigned
- Folder: `special-bookings`

### **Step 4: Test the Flow**

1. **Create Special Booking:**
   - Go to `/booking`
   - Enter >100 adults/children
   - Fill special form
   - Upload 1-2 documents
   - Submit

2. **Check Notifications:**
   - SMS received: "Booking pending"
   - Email received: "Awaiting approval"

3. **Admin Review:**
   - Login to `/admin/login`
   - Go to `/admin/special-bookings`
   - View booking details
   - Check documents (click "View")
   - Approve or Reject

4. **Final Notifications:**
   - SMS received: "Approved/Rejected"
   - Email received: Full details

---

## 📧 Notification Templates

### **Pending SMS:**
```
Sewanagala Sugar Factory Tour - Your special booking request for [CAPACITY] visitors on [DATE] at [TIME] has been received. Booking ID: [REF]. Status: PENDING ADMIN APPROVAL. You will receive confirmation once reviewed.
```

### **Approved SMS:**
```
Sewanagala Sugar Factory Tour - APPROVED! Your special booking for [CAPACITY] visitors on [DATE] at [TIME] has been confirmed. Booking ID: [REF]. Please arrive 15 minutes early.
```

### **Rejected SMS:**
```
Sewanagala Sugar Factory Tour - Your special booking request (ID: [REF]) has been declined. Reason: [REASON]. Please contact us for more information.
```

---

## 🔐 Security Features

1. ✅ **File validation** - Only PDF/Images, max 10MB
2. ✅ **Auth required** - Admin routes protected with JWT
3. ✅ **SQL injection protection** - Parameterized queries
4. ✅ **Transaction rollback** - Database consistency
5. ✅ **Error logging** - All notifications tracked
6. ✅ **Audit trail** - Admin actions logged

---

## 📊 Database Tables

### **bookings** (Updated)
```sql
- is_special_booking: BOOLEAN
- requested_capacity: INT
- special_request_reason: TEXT
- legal_documents: JSON
- special_booking_status: ENUM('pending', 'approved', 'rejected')
- admin_review_notes: TEXT
- reviewed_by: VARCHAR(255)
- reviewed_at: TIMESTAMP
```

### **special_booking_documents** (New)
```sql
- id: INT (PK)
- booking_id: INT (FK)
- document_type: VARCHAR(50)
- document_url: VARCHAR(500)
- cloudinary_public_id: VARCHAR(255)
- file_name: VARCHAR(255)
- file_size: INT
- mime_type: VARCHAR(100)
- uploaded_at: TIMESTAMP
```

### **special_booking_notifications** (New)
```sql
- id: INT (PK)
- booking_id: INT (FK)
- notification_type: ENUM
- sent_at: TIMESTAMP
- status: ENUM('sent', 'failed')
- response: TEXT
```

---

## 🧪 Testing Checklist

- [ ] Normal booking (≤100) still works
- [ ] Special form appears when >100
- [ ] File upload works (PDF/Images)
- [ ] Pending SMS sent
- [ ] Pending Email sent
- [ ] Booking shows in admin panel
- [ ] Document preview works
- [ ] Approve sends SMS + Email
- [ ] Reject sends SMS + Email
- [ ] Status updates correctly
- [ ] Admin actions logged

---

## 🚀 Deployment

1. Run database migration
2. Configure Cloudinary credentials
3. Test email/SMS services
4. Deploy frontend + backend
5. Monitor first special booking

---

## 📞 Support

For issues or questions:
- Check logs in `special_booking_notifications` table
- Review admin actions in `admin_actions` table
- Verify Cloudinary uploads in dashboard
- Test SMS/Email delivery separately

---

## ✨ Features Summary

✅ **100 visitor default capacity**
✅ **Special requests for >100**
✅ **Cloudinary document uploads**
✅ **Admin approval workflow**
✅ **4 total notifications** (2 pending + 2 final)
✅ **Document viewer in admin**
✅ **Email + SMS for all stages**
✅ **Complete audit trail**
✅ **Error handling & logging**

---

**Implementation Complete!** 🎉
