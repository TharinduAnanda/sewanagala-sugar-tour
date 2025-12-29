# Automatic Time Slots Generation - Implementation Guide

## Overview
You now have **3 different ways** to generate tour time slots automatically without manual insertion:

---

## **Option 1: Automatic Initialization on Server Startup** ✅ RECOMMENDED

### How It Works:
- When the server starts, it automatically checks if slots exist
- If no slots found, it generates 60 days worth of slots
- Only generates once (idempotent - won't create duplicates)
- Can be disabled by setting environment variable

### Setup:
Already implemented! Just restart your server:

```bash
npm start
```

### Configuration:
Add to `.env` file to disable auto-generation:
```env
AUTO_GENERATE_SLOTS=false
```

### Output:
```
✅ Slot initialization complete: 240 slots generated, 20 skipped
```

---

## **Option 2: Admin API Endpoint** ✅ IMPLEMENTED

### What It Does:
Allows admins to generate slots on-demand with custom parameters.

### Endpoint:
```
POST /api/slots/admin/generate
```

### Request Body (all optional):
```json
{
  "daysAhead": 60,        // How many days to generate (1-365, default: 60)
  "slotsPerDay": 4,       // Number of slots per day (1-10, default: 4)
  "maxCapacity": 30       // Capacity per slot (1-200, default: 30)
}
```

### Examples:

**Generate 90 days of slots with 5 slots per day:**
```bash
curl -X POST http://localhost:5000/api/slots/admin/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d {
    "daysAhead": 90,
    "slotsPerDay": 5,
    "maxCapacity": 40
  }
```

**Using JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/slots/admin/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    daysAhead: 90,
    slotsPerDay: 5,
    maxCapacity: 40
  })
});

const result = await response.json();
console.log(`Generated: ${result.generatedCount} slots`);
```

### Response:
```json
{
  "success": true,
  "message": "Generated 240 time slots",
  "generatedCount": 240,
  "skippedCount": 20,
  "configuration": {
    "daysAhead": 60,
    "slotsPerDay": 4,
    "maxCapacity": 30,
    "timeSlots": [
      {"start": "08:00", "end": "10:00"},
      {"start": "10:00", "end": "12:00"},
      {"start": "12:00", "end": "14:00"},
      {"start": "14:00", "end": "16:00"}
    ]
  }
}
```

---

## **Option 3: Daily Automatic Generation with Cron** (Optional)

### Setup (if you want daily slot auto-generation):

1. **Install node-cron:**
```bash
npm install node-cron
```

2. **Create a cron service** (`server/services/slotCron.js`):
```javascript
const cron = require('node-cron');
const { initializeSlots } = require('./slotService');

// Run every day at 2 AM
const startSlotCron = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('🕐 Running daily slot generation...');
    try {
      await initializeSlots();
    } catch (err) {
      console.error('Error in slot cron:', err);
    }
  });
};

module.exports = { startSlotCron };
```

3. **Add to server.js:**
```javascript
const { startSlotCron } = require('./services/slotCron');

app.listen(PORT, async () => {
  // ... existing code ...
  
  // Start cron jobs
  startSlotCron();
});
```

---

## **Slot Generation Details**

### Time Slots Generated:
- **8:00 AM - 10:00 AM**
- **10:00 AM - 12:00 PM**
- **12:00 PM - 2:00 PM**
- **2:00 PM - 4:00 PM**

### Days Covered:
- ✅ Weekdays only (Monday - Friday)
- ❌ Weekends (Saturday - Sunday) are skipped
- ❌ Factory closure dates are respected

### Default Values:
- **Capacity per slot:** 30 visitors
- **Days generated:** 60 days
- **Booked count:** 0 (all slots start empty)

---

## **How to Use in Your Application**

### For Users (Booking):
No changes needed! Users just:
1. Select a date in the booking form
2. Available slots appear automatically
3. Select a time slot to complete booking

### For Admins:
Add a button in admin panel to trigger slot generation:

```jsx
// Admin component example
const handleGenerateSlots = async () => {
  const response = await fetch('http://localhost:5000/api/slots/admin/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      daysAhead: 90,
      slotsPerDay: 4,
      maxCapacity: 30
    })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Successfully generated ${result.generatedCount} slots!`);
  }
};

return (
  <button onClick={handleGenerateSlots}>
    Generate Time Slots (90 days)
  </button>
);
```

---

## **Which Option Should You Use?**

| Option | Best For | Effort | Auto? |
|--------|----------|--------|-------|
| **Startup Init** | Most projects | ✅ Low | ✅ Yes |
| **Admin API** | Manual control | ✅ Low | ❌ No |
| **Cron Job** | Always stay ahead | ⚠️ Medium | ✅ Yes |

**Recommendation:** Use **Option 1 (Startup)** as default. Add **Option 2 (Admin API)** for flexibility. Use **Option 3 (Cron)** only if you need continuous daily updates.

---

## **Troubleshooting**

### Slots not generating at startup?
Check if `AUTO_GENERATE_SLOTS` is set to `false` in `.env`

### "No slots available" still showing?
- Verify slots were created: Check database query
- Make sure you selected a weekday (not weekend)
- Check if factory closure date blocks the date

### Want to regenerate existing slots?
Delete old slots first:
```sql
DELETE FROM tour_slots WHERE slot_date >= CURDATE();
```

Then restart the server or call the admin endpoint.

---

## **API Reference**

### Get Available Slots (User):
```
GET /api/slots/available/{date}
```

### Generate Slots (Admin):
```
POST /api/slots/admin/generate
```

### Get All Slots (Admin):
```
GET /api/slots/
```

### Update Slot Capacity (Admin):
```
PUT /api/slots/{id}
```
