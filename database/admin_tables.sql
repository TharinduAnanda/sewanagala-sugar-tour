-- Admin Actions Log Table
CREATE TABLE IF NOT EXISTS `admin_actions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `admin_email` VARCHAR(255) NOT NULL,
  `action_type` VARCHAR(50) NOT NULL,
  `booking_id` INT(11) DEFAULT NULL,
  `slot_id` INT(11) DEFAULT NULL,
  `details` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_email` (`admin_email`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add missing columns to bookings table if they don't exist
ALTER TABLE `bookings` 
ADD COLUMN IF NOT EXISTS `admin_notes` TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `cancellation_reason` TEXT DEFAULT NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS `idx_status_date` ON `bookings` (`status`, `visit_date`);
CREATE INDEX IF NOT EXISTS `idx_slot_id` ON `bookings` (`slot_id`);

-- Ensure tour_slots table has proper structure
CREATE TABLE IF NOT EXISTS `tour_slots` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `slot_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `max_capacity` INT(11) NOT NULL DEFAULT 50,
  `booked_count` INT(11) NOT NULL DEFAULT 0,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slot` (`slot_date`, `start_time`),
  KEY `idx_slot_date` (`slot_date`),
  KEY `idx_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin sessions table (optional, for enhanced security)
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `admin_email` VARCHAR(255) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_admin_email` (`admin_email`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
