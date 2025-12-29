# Tour Slots - Quick Setup & Testing Guide

## 🚀 Quick Start

### 1. Database Setup
The `tour_slots` table has been added to `database/schema.sql`. Run the schema:

```bash
mysql -u root -p sewanagala_tour < database/schema.sql
```

Or manually in MySQL:
```sql
USE sewanagala_tour;

CREATE TABLE tour_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL DEFAULT 50,
    booked_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_slot (slot_date, start_time),
    INDEX idx_slot_date (slot_date),
    INDEX idx_slot_active (is_active),
    INDEX idx_slot_availability (slot_date, is_active)
);
```

### 2. Start the Backend Server
```bash
cd server
npm start
```

Server runs on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd client
npm start
```

Frontend runs on `http://localhost:3000`

## 📋 Testing Tour Slots

### Test 1: Create a Tour Slot

**Steps:**
1. Navigate to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Go to Dashboard → "🕐 Tour Slots"
4. Click "➕ Create Slot"
5. Fill form:
   - Date: Tomorrow or any weekday (not weekend)
   - Start Time: 09:00
   - End Time: 11:00
   - Capacity: 50
   - Notes: Morning tour slot
6. Click "➕ Create Slot"

**Expected Result:** ✅ Slot created successfully message

---

### Test 2: View All Slots

**Steps:**
1. Click "📋 View Slots" tab
2. See newly created slot in table

**Expected Result:** ✅ Slot appears in table with:
- Correct date and time
- Capacity: 50
- Booked: 0
- Available: 50
- Occupancy: 0%
- Status: ✓ Active

---

### Test 3: Filter Slots

**Steps:**
1. In "View Slots" tab
2. Set Start Date: Today
3. Set End Date: Next week
4. Click filter (or click outside input)
5. Change Status: Active/Inactive

**Expected Result:** ✅ Slots filtered correctly

---

### Test 4: Edit a Slot

**Steps:**
1. In "View Slots" tab
2. Click "✏️" edit button on any slot
3. Change:
   - Start Time: 10:00
   - End Time: 12:00
   - Capacity: 75
   - Notes: Updated morning slot
4. Click "💾 Update Slot"

**Expected Result:** ✅ Slot updated successfully message

---

### Test 5: Delete a Slot

**Steps:**
1. In "View Slots" tab
2. Create a new empty slot (no bookings)
3. Click "🗑️" delete button
4. Confirm deletion

**Expected Result:** ✅ Slot deleted successfully message

---

### Test 6: Prevent Overbooking

**Using API:**

```bash
# Get available slots for a date
curl "http://localhost:5000/api/slots/available/2025-12-15"

# Book slot (add 20 visitors)
curl -X POST "http://localhost:5000/api/slots/1/book" \
  -H "Content-Type: application/json" \
  -d '{"slotId": 1, "visitorCount": 20}'

# Response should show:
# bookedCount: 20
# availableCapacity: 30
```

---

### Test 7: Prevent Duplicate Slots

**Steps:**
1. Create slot for Dec 15, 09:00-11:00
2. Try to create another slot for same date and time
3. Try to create overlapping slot (09:30-11:30)

**Expected Result:** ✅ Error message: "Time slot overlaps with existing slot"

---

### Test 8: Prevent Weekend Slots

**Steps:**
1. Try to create slot for Saturday or Sunday
2. Click "➕ Create Slot"

**Expected Result:** ✅ Error message: "Cannot create slots for weekends"

---

### Test 9: Responsive Design

**Test on Different Devices:**

1. **Desktop** (1200px+)
   - Full table view
   - Multi-column forms
   - All elements visible

2. **Tablet** (768px - 1199px)
   - Table still visible
   - Horizontal scrolling for table
   - Adjusted spacing

3. **Mobile** (480px)
   - Table converts to scrollable view
   - Single column forms
   - Touch-friendly buttons

4. **Small Mobile** (360px)
   - Compact layout
   - All elements accessible
   - Readable font sizes

---

### Test 10: Summary Statistics

**Steps:**
1. Create 3-4 slots with different capacities
2. Book some slots with visitors
3. Scroll to bottom of "View Slots"

**Expected Result:** ✅ Summary shows:
- Total Slots: 3 or 4
- Total Capacity: Sum of all capacities
- Total Booked: Sum of all booked
- Full Slots: Count of full ones

---

## 🔍 API Testing with cURL

### Get Available Slots
```bash
curl "http://localhost:5000/api/slots/available/2025-12-15"
```

### Get All Slots (Admin)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/slots"
```

### Create Slot (Admin)
```bash
curl -X POST "http://localhost:5000/api/slots" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "slot_date": "2025-12-15",
    "start_time": "09:00",
    "end_time": "11:00",
    "max_capacity": 50,
    "notes": "Morning tour"
  }'
```

### Update Slot (Admin)
```bash
curl -X PUT "http://localhost:5000/api/slots/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "start_time": "10:00",
    "end_time": "12:00",
    "max_capacity": 75,
    "notes": "Updated time"
  }'
```

### Delete Slot (Admin)
```bash
curl -X DELETE "http://localhost:5000/api/slots/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Book Slot
```bash
curl -X POST "http://localhost:5000/api/slots/1/book" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": 1,
    "visitorCount": 20
  }'
```

---

## 🧪 Test Sample Data

Run this in MySQL to create test slots:

```sql
USE sewanagala_tour;

-- Create slots for the next week
INSERT INTO tour_slots (slot_date, start_time, end_time, max_capacity, booked_count, notes) VALUES
('2025-12-08', '09:00', '11:00', 50, 0, 'Morning slot'),
('2025-12-08', '13:00', '15:00', 50, 25, 'Afternoon slot - Half full'),
('2025-12-09', '09:00', '11:00', 40, 40, 'Morning slot - Full'),
('2025-12-09', '14:00', '16:00', 60, 10, 'Late afternoon slot'),
('2025-12-10', '10:00', '12:00', 50, 0, 'Mid-morning slot'),
('2025-12-11', '09:00', '11:00', 50, 35, 'Morning slot - 70% full'),
('2025-12-12', '13:00', '15:00', 50, 0, 'Afternoon slot');

-- Verify
SELECT * FROM tour_slots ORDER BY slot_date, start_time;
```

---

## 🐛 Debugging

### Enable Console Logs

**Backend (server.js):**
Add to see detailed logs:
```javascript
console.log('Slot creation request:', req.body);
```

**Frontend (DevTools Console):**
Watch network tab for API calls

### Common Issues

| Issue | Solution |
|-------|----------|
| Table doesn't exist | Run `schema.sql` again |
| Cannot create slot on weekend | Select a weekday |
| 401 Unauthorized | Check admin token in localStorage |
| Slot not showing in list | Refresh page or check filters |
| Cannot delete slot | Make sure slot has no bookings |
| Time validation error | Ensure start < end time |

---

## ✅ Verification Checklist

After implementation, verify:

- [ ] tour_slots table exists in database
- [ ] Can access `/admin/slots` page
- [ ] Can create a slot
- [ ] Can view all slots in table
- [ ] Can filter slots by date and status
- [ ] Can edit a slot
- [ ] Can delete an empty slot
- [ ] Cannot delete slot with bookings
- [ ] Cannot create weekend slots
- [ ] Cannot create overlapping slots
- [ ] Booking updates booked count
- [ ] Summary statistics show correct totals
- [ ] Responsive on mobile (480px)
- [ ] Responsive on tablet (768px)
- [ ] All error messages display correctly
- [ ] API endpoints return correct JSON

---

## 📞 Support

If you encounter issues:

1. **Check Server Logs**
   ```bash
   # Terminal where server is running
   ```

2. **Check Browser Console**
   - F12 → Console tab
   - Look for network errors

3. **Check Database**
   ```sql
   SELECT * FROM tour_slots;
   DESC tour_slots;
   ```

4. **Test API Directly**
   - Use cURL or Postman
   - Verify endpoint responses

---

**Ready to test?** Start with Test 1 and work your way through! 🎉
