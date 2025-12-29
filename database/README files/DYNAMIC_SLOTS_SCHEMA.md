# Updated Database Schema - Dynamic Slot Generation

## Summary of Changes

### ✅ What Was Removed:

1. **`tour_slots` Table** - REMOVED
   - No longer storing time slots in database
   - Slots are now generated dynamically on-the-fly
   - Slots are: 8-10 AM, 10 AM-12 PM, 12-2 PM, 2-4 PM (fixed 2-hour intervals)

2. **`slot_id` Column** - REMOVED from `bookings` table
   - Bookings now reference slots by `visit_time` and `visit_date`
   - No foreign key constraint needed

3. **Related Indexes** - REMOVED
   - `idx_slot_date`
   - `idx_slot_active`
   - `idx_slot_availability`
   - `unique_slot`

### 📋 Database Tables (5 tables remain):

```
1. stations
   ├─ id (PK)
   ├─ name
   ├─ description
   ├─ station_number (UNIQUE)
   ├─ latitude, longitude
   ├─ map_x, map_y
   ├─ category
   ├─ duration_minutes
   ├─ audio_guide_url
   ├─ is_active
   ├─ created_at
   └─ updated_at

2. media
   ├─ id (PK)
   ├─ station_id (FK → stations)
   ├─ media_type (image|video)
   ├─ cloudinary_url
   ├─ cloudinary_public_id
   ├─ title
   ├─ description
   ├─ display_order
   └─ created_at

3. bookings ✏️ UPDATED
   ├─ id (PK)
   ├─ booking_id (UNIQUE)
   ├─ phone
   ├─ name
   ├─ email
   ├─ visitor_count
   ├─ visit_date (used with visit_time to identify slot)
   ├─ visit_time (slot start time: 08:00, 10:00, 12:00, 14:00)
   ├─ special_requirements
   ├─ status (pending|confirmed|completed|cancelled)
   ├─ created_at
   └─ updated_at
   
   (Note: slot_id column removed)

4. tour_logs
   ├─ id (PK)
   ├─ visitor_id
   ├─ station_id (FK → stations)
   ├─ visited_at
   └─ duration_seconds

5. factory_closures
   ├─ id (PK)
   ├─ closure_date (UNIQUE) - checked before generating slots
   ├─ reason
   ├─ closure_type
   ├─ notes
   ├─ created_at
   └─ updated_at

❌ REMOVED: tour_slots table
```

### 🔄 How Slot Generation Works Now:

**Old Way (Removed):**
- Insert 4 slots × 365 days = 1,460 rows in database
- Pre-populate database with months of data
- Scale storage issues with large date ranges

**New Way (Dynamic):**
- User selects date in form
- API receives date: `/api/slots/available/2025-12-04`
- `slotGenerationService.js` generates 4 slots on-the-fly
- Queries `bookings` table to calculate availability
- Returns slots with real-time capacity info
- **No database slot records needed!**

### 📊 Fixed Slot Configuration (in code):

```javascript
// slotGenerationService.js
FACTORY_OPEN = '08:00'
FACTORY_CLOSE = '16:00' (4 PM)
TOUR_DURATION_HOURS = 2
MAX_CAPACITY_PER_SLOT = 30

FIXED_SLOTS = [
  { start_time: '08:00', end_time: '10:00' },
  { start_time: '10:00', end_time: '12:00' },
  { start_time: '12:00', end_time: '14:00' },
  { start_time: '14:00', end_time: '16:00' }
]
```

### ✅ Remaining Indexes (7 total):

```sql
idx_station_number          -- On stations(station_number)
idx_station_category        -- On stations(category)
idx_station_active          -- On stations(is_active)
idx_media_station           -- On media(station_id)
idx_media_type              -- On media(media_type)
idx_tour_visitor            -- On tour_logs(visitor_id)
idx_tour_station            -- On tour_logs(station_id)
idx_tour_date               -- On tour_logs(visited_at)
idx_bookings_phone          -- On bookings(phone)
idx_bookings_booking_id     -- On bookings(booking_id)
idx_bookings_status         -- On bookings(status)
idx_bookings_visit_date     -- On bookings(visit_date)
idx_factory_closures        -- On factory_closures(closure_date)
```

### 🎯 Migration Steps (if you have existing tour_slots data):

```sql
-- 1. Backup existing tour_slots data (if needed)
-- CREATE TABLE tour_slots_backup AS SELECT * FROM tour_slots;

-- 2. Drop the tour_slots table
-- DROP TABLE tour_slots;

-- 3. Run the updated schema.sql to recreate database structure
```

### 📝 Booking Record Example:

```json
{
  "booking_id": "BK1735864400000ABCDE",
  "phone": "+94771234567",
  "name": "John Doe",
  "email": "john@example.com",
  "visitor_count": 5,
  "visit_date": "2025-12-04",
  "visit_time": "08:00",
  "special_requirements": "Wheelchair accessible",
  "status": "pending"
}
```

The system automatically knows that `08:00` slot on `2025-12-04` is a 2-hour tour (8 AM - 10 AM) with 30-person capacity.

### 🚀 Benefits:

✅ Cleaner database structure
✅ No slot pre-population needed
✅ Scalable to any date range
✅ Real-time availability based on actual bookings
✅ Less storage usage
✅ Easier to modify factory hours (just change the code)
