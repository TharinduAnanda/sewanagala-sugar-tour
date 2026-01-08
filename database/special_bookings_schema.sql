-- Special Bookings Enhancement
-- Add columns to bookings table for special large group bookings

-- 1. Update bookings table
ALTER TABLE bookings 
ADD COLUMN is_special_booking BOOLEAN DEFAULT FALSE AFTER status,
ADD COLUMN requested_capacity INT DEFAULT NULL AFTER children,
ADD COLUMN special_request_reason TEXT DEFAULT NULL AFTER special_requests,
ADD COLUMN legal_documents JSON DEFAULT NULL AFTER special_request_reason,
ADD COLUMN special_booking_status ENUM('pending', 'approved', 'rejected') DEFAULT NULL AFTER legal_documents,
ADD COLUMN admin_review_notes TEXT DEFAULT NULL AFTER special_booking_status,
ADD COLUMN reviewed_by VARCHAR(255) DEFAULT NULL AFTER admin_review_notes,
ADD COLUMN reviewed_at TIMESTAMP NULL DEFAULT NULL AFTER reviewed_by;

-- 2. Create special_booking_documents table for tracking uploads
CREATE TABLE IF NOT EXISTS special_booking_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  document_type VARCHAR(50) NOT NULL COMMENT 'letter, permit, authorization, etc.',
  document_url VARCHAR(500) NOT NULL COMMENT 'Cloudinary URL',
  cloudinary_public_id VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL COMMENT 'Size in bytes',
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create special_booking_notifications table
CREATE TABLE IF NOT EXISTS special_booking_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  notification_type ENUM('pending_sms', 'pending_email', 'approved_sms', 'approved_email', 'rejected_sms', 'rejected_email') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('sent', 'failed') DEFAULT 'sent',
  response TEXT DEFAULT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id),
  INDEX idx_notification_type (notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Update tour_slots table to increase max_capacity
ALTER TABLE tour_slots 
MODIFY COLUMN max_capacity INT DEFAULT 100 COMMENT 'Default capacity per slot';

-- 5. Add comments to existing columns
ALTER TABLE bookings 
MODIFY COLUMN adults INT NOT NULL DEFAULT 1 COMMENT 'Number of adults',
MODIFY COLUMN children INT NOT NULL DEFAULT 0 COMMENT 'Number of children',
MODIFY COLUMN total_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Tour fee (if applicable)';

-- 6. Create view for admin special bookings dashboard
CREATE OR REPLACE VIEW special_bookings_pending AS
SELECT 
  b.id,
  b.booking_reference,
  b.name,
  b.email,
  b.phone,
  b.visit_date,
  b.visit_time,
  b.requested_capacity,
  b.special_request_reason,
  b.special_booking_status,
  b.created_at,
  COUNT(DISTINCT sbd.id) as document_count,
  ts.max_capacity as slot_capacity
FROM bookings b
LEFT JOIN special_booking_documents sbd ON b.id = sbd.booking_id
LEFT JOIN tour_slots ts ON b.slot_id = ts.id
WHERE b.is_special_booking = TRUE 
  AND b.special_booking_status = 'pending'
GROUP BY b.id
ORDER BY b.created_at DESC;

-- 7. Add index for better performance
CREATE INDEX idx_special_booking ON bookings(is_special_booking, special_booking_status);
CREATE INDEX idx_visit_date_time ON bookings(visit_date, visit_time);

-- Sample data update - set all existing slots to 100 capacity
UPDATE tour_slots SET max_capacity = 100 WHERE max_capacity != 100;
