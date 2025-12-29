-- Fix map_x and map_y columns to support decimal values
-- Change from INT to DECIMAL(5,2) to support values like 12.17, 30.86, etc.

ALTER TABLE `stations` 
  MODIFY COLUMN `map_x` DECIMAL(5,2) DEFAULT NULL,
  MODIFY COLUMN `map_y` DECIMAL(5,2) DEFAULT NULL;

-- Update stations with correct coordinate values (as percentages)
UPDATE stations SET map_x = 12.17, map_y = 57.98 WHERE station_number = 1;
UPDATE stations SET map_x = 30.86, map_y = 68.99 WHERE station_number = 2;
UPDATE stations SET map_x = 31.60, map_y = 50.27 WHERE station_number = 3;
UPDATE stations SET map_x = 31.47, map_y = 39.39 WHERE station_number = 4;
UPDATE stations SET map_x = 32.09, map_y = 25.46 WHERE station_number = 5;
UPDATE stations SET map_x = 38.48, map_y = 43.96 WHERE station_number = 6;
UPDATE stations SET map_x = 52.74, map_y = 43.96 WHERE station_number = 7;
UPDATE stations SET map_x = 64.05, map_y = 21.33 WHERE station_number = 8;
UPDATE stations SET map_x = 46.72, map_y = 60.94 WHERE station_number = 9;
UPDATE stations SET map_x = 46.35, map_y = 71.82 WHERE station_number = 10;
UPDATE stations SET map_x = 46.47, map_y = 88.36 WHERE station_number = 11;
UPDATE stations SET map_x = 14.26, map_y = 23.29 WHERE station_number = 12;

-- Note: Stations 13, 14, 15 have values > 100, which seem incorrect for percentage coordinates
-- These might need to be recalculated or verified
UPDATE stations SET map_x = 88.00, map_y = 16.00 WHERE station_number = 13; -- Divided by 10 to fit percentage scale
UPDATE stations SET map_x = 92.00, map_y = 22.00 WHERE station_number = 14; -- Divided by 10 to fit percentage scale
UPDATE stations SET map_x = 80.00, map_y = 32.00 WHERE station_number = 15; -- Divided by 10 to fit percentage scale

-- Verify the changes
SELECT station_number, name, map_x, map_y FROM stations ORDER BY station_number;
