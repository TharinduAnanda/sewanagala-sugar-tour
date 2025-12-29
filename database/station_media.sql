-- Create station_media table for storing Cloudinary media uploads
CREATE TABLE IF NOT EXISTS station_media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id INT NOT NULL,
  media_type ENUM('image', 'video') NOT NULL,
  media_url VARCHAR(500) NOT NULL,
  caption TEXT,
  cloudinary_public_id VARCHAR(255),
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  INDEX idx_station_id (station_id),
  INDEX idx_upload_date (upload_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
