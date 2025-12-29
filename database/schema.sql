-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2025 at 05:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sewanagala_tour`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_id` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `visitor_count` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `visit_time` varchar(10) NOT NULL,
  `special_requirements` text DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `factory_closures`
--

CREATE TABLE `factory_closures` (
  `id` int(11) NOT NULL,
  `closure_date` date NOT NULL,
  `reason` varchar(255) NOT NULL,
  `closure_type` enum('maintenance','holiday','special_event','other') DEFAULT 'maintenance',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `factory_closures`
--

INSERT INTO `factory_closures` (`id`, `closure_date`, `reason`, `closure_type`, `notes`, `created_at`, `updated_at`) VALUES
(1, '2025-12-03', 'svsdv', 'maintenance', '', '2025-12-02 08:26:26', '2025-12-02 08:26:26'),
(957, '2025-12-17', 'afgcgdsg', 'maintenance', '', '2025-12-02 08:55:20', '2025-12-02 08:55:20'),
(1060, '2025-01-13', 'Duruthu Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1061, '2025-01-14', 'Tamil Thai Pongal Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1062, '2025-02-04', 'Independence Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1063, '2025-02-12', 'Nawam Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1064, '2025-02-26', 'Maha Sivarathri Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1065, '2025-03-13', 'Madin Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1066, '2025-03-31', 'Id-Ul-Fitr (Ramazan Festival Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1067, '2025-04-12', 'Bak Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1068, '2025-04-13', 'Day prior to Sinhala & Tamil New Year Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1069, '2025-04-14', 'Sinhala & Tamil New Year Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1070, '2025-04-18', 'Good Friday', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1071, '2025-05-01', 'May Day (International Workers\' Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1072, '2025-05-12', 'Vesak Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1073, '2025-05-13', 'Day following Vesak Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1074, '2025-06-07', 'Id-Ul-Alha (Hadji Festival Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1075, '2025-06-10', 'Poson Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1076, '2025-07-10', 'Esala Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1077, '2025-08-08', 'Nikini Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1078, '2025-09-05', 'Milad-Un-Nabi (Holy Prophet\'s Birthday)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1079, '2025-09-07', 'Binara Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1080, '2025-10-06', 'Vap Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1081, '2025-10-20', 'Deepavali Festival Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1082, '2025-11-05', 'Il Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1083, '2025-12-04', 'Unduvap Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1084, '2025-12-25', 'Christmas Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1085, '2026-01-03', 'Duruthu Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1086, '2026-01-15', 'Tamil Thai Pongal Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1087, '2026-02-01', 'Nawam Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1088, '2026-02-04', 'Independence Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1089, '2026-02-15', 'Maha Sivarathri Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1090, '2026-03-02', 'Madin Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1091, '2026-03-21', 'Id-Ul-Fitr (Ramazan Festival Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1092, '2026-04-01', 'Bak Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1093, '2026-04-03', 'Good Friday', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1094, '2026-04-13', 'Day prior to Sinhala & Tamil New Year Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1095, '2026-04-14', 'Sinhala & Tamil New Year Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1096, '2026-05-01', 'May Day (International Workers\' Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1098, '2026-05-02', 'Day following Vesak Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1099, '2026-05-28', 'Id-Ul-Alha (Hadji Festival Day)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1100, '2026-05-30', 'Adhi Poson Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1101, '2026-06-29', 'Poson Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1102, '2026-07-29', 'Esala Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1103, '2026-08-26', 'Milad-Un-Nabi (Holy Prophet\'s Birthday)', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1104, '2026-08-27', 'Nikini Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1105, '2026-09-26', 'Binara Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1106, '2026-10-25', 'Vap Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1107, '2026-11-08', 'Deepavali Festival Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1108, '2026-11-24', 'Il Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1109, '2026-12-23', 'Unduvap Full Moon Poya Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15'),
(1110, '2026-12-25', 'Christmas Day', 'holiday', 'Sri Lankan National Holiday', '2025-12-02 08:58:15', '2025-12-02 08:58:15');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `media_type` enum('image','video') NOT NULL,
  `cloudinary_url` varchar(500) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `station_id`, `media_type`, `cloudinary_url`, `cloudinary_public_id`, `title`, `description`, `display_order`, `created_at`) VALUES
(1, 1, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'reception_1', 'Reception Area', 'Modern visitor reception center', 1, '2025-12-02 08:20:17'),
(2, 2, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'unloading_1', 'Sugarcane Delivery', 'Trucks delivering fresh sugarcane', 1, '2025-12-02 08:20:17'),
(3, 3, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'preparation_1', 'Cane Shredders', 'Preparation machinery in action', 1, '2025-12-02 08:20:17'),
(4, 4, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'milling_1', 'Sugar Mill', 'Heavy rollers extracting juice', 1, '2025-12-02 08:20:17'),
(5, 4, 'video', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', 'milling_video_1', 'Milling Process', 'Video of the milling operation', 2, '2025-12-02 08:20:17'),
(6, 5, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'clarification_1', 'Clarification Tanks', 'Juice purification process', 1, '2025-12-02 08:20:17'),
(7, 6, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'evaporation_1', 'Evaporators', 'Multiple effect evaporators', 1, '2025-12-02 08:20:17'),
(8, 7, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'crystallization_1', 'Vacuum Pans', 'Sugar crystallization in progress', 1, '2025-12-02 08:20:17'),
(9, 8, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'centrifuge_1', 'Centrifuges', 'Sugar separation machinery', 1, '2025-12-02 08:20:17'),
(10, 11, 'image', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'packaging_1', 'Packaging Line', 'Automated packaging system', 1, '2025-12-02 08:20:17'),
(11, 11, 'video', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', 'packaging_video_1', 'Packaging Process', 'Video of packaging operations', 2, '2025-12-02 08:20:17');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `station_number` int(11) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `map_x` int(11) DEFAULT NULL,
  `map_y` int(11) DEFAULT NULL,
  `category` enum('processing','machinery','storage','office','history') DEFAULT 'processing',
  `duration_minutes` int(11) DEFAULT 5,
  `audio_guide_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `description`, `station_number`, `latitude`, `longitude`, `map_x`, `map_y`, `category`, `duration_minutes`, `audio_guide_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Reception and Visitor Center', 'Welcome to Sewanagala Sugar Factory! Start your tour here to learn about the factory history and get an overview of the sugar production process. Our reception area features interactive displays and historical exhibits.', 1, 6.88330000, 81.30000000, 100, 80, 'office', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(2, 'Sugarcane Unloading Bay', 'Watch as freshly harvested sugarcane arrives from local farms. Large trucks deliver tons of sugarcane daily, which is weighed and inspected for quality before entering the production process.', 2, 6.88350000, 81.30020000, 180, 120, 'processing', 8, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(3, 'Cane Preparation Area', 'The sugarcane is cleaned and prepared for processing. Giant knives and shredders break down the cane into smaller pieces, preparing it for juice extraction.', 3, 6.88370000, 81.30040000, 250, 140, 'machinery', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(4, 'Milling Station', 'This is where the magic begins! Heavy rollers crush the prepared sugarcane to extract the sweet juice. The mill operates 24/7 during the crushing season, processing thousands of tons of cane.', 4, 6.88390000, 81.30060000, 320, 160, 'processing', 12, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(5, 'Juice Clarification Plant', 'The extracted juice undergoes purification here. Lime and heat are used to remove impurities, resulting in clear, clean juice ready for further processing.', 5, 6.88410000, 81.30080000, 380, 200, 'processing', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(6, 'Evaporation Station', 'Watch as the clarified juice is concentrated through multiple evaporator stages. Water is removed to create a thick syrup, which will eventually crystallize into sugar.', 6, 6.88430000, 81.30100000, 450, 240, 'machinery', 15, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(7, 'Crystallization Area', 'The concentrated syrup is carefully heated and cooled in large vacuum pans. Sugar crystals begin to form in this critical stage of production.', 7, 6.88450000, 81.30120000, 520, 280, 'processing', 12, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(8, 'Centrifugal Separation', 'High-speed centrifuges spin the crystallized mixture to separate sugar crystals from molasses. The separated raw sugar is light brown in color.', 8, 6.88470000, 81.30140000, 580, 320, 'machinery', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(9, 'Sugar Drying and Cooling', 'Hot, moist sugar crystals are dried and cooled to the perfect moisture content. This ensures the sugar will store well and flow freely.', 9, 6.88490000, 81.30160000, 640, 280, 'processing', 8, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(10, 'Quality Control Laboratory', 'Our state-of-the-art laboratory tests sugar samples for purity, color, moisture content, and other quality parameters. Only the finest sugar leaves our factory.', 10, 6.88510000, 81.30180000, 700, 240, 'office', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(11, 'Packaging Line', 'Finished sugar is automatically weighed and packed into various sized bags, from small retail packets to large industrial sacks. Modern packaging machines ensure accuracy and hygiene.', 11, 6.88530000, 81.30200000, 760, 180, 'machinery', 12, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(12, 'Warehouse and Storage', 'Our climate-controlled warehouses can store thousands of tons of packaged sugar. Proper storage maintains product quality until distribution to markets across the country.', 12, 6.88550000, 81.30220000, 820, 120, 'storage', 8, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(13, 'By-Products Processing', 'Nothing goes to waste! Bagasse (fibrous residue) is used to generate electricity for the factory, while molasses is sold for animal feed and industrial uses.', 13, 6.88570000, 81.30240000, 880, 160, 'processing', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(14, 'Power Generation Plant', 'Our bagasse-powered boilers generate steam and electricity. The factory is nearly energy self-sufficient, making sugar production environmentally sustainable.', 14, 6.88590000, 81.30260000, 920, 220, 'machinery', 10, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17'),
(15, 'Historical Exhibition Hall', 'Learn about the rich history of sugar production in Sri Lanka and the development of Sewanagala Sugar Factory through photographs, artifacts, and interactive displays.', 15, 6.88610000, 81.30280000, 800, 320, 'history', 15, NULL, 1, '2025-12-02 08:20:17', '2025-12-02 08:20:17');

-- --------------------------------------------------------

--
-- Table structure for table `tour_logs`
--

CREATE TABLE `tour_logs` (
  `id` int(11) NOT NULL,
  `visitor_id` varchar(100) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `duration_seconds` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_logs`
--

INSERT INTO `tour_logs` (`id`, `visitor_id`, `station_id`, `visited_at`, `duration_seconds`) VALUES
(1, 'visitor_1234567890_abc123', 1, '2025-12-02 06:20:17', 600),
(2, 'visitor_1234567890_abc123', 2, '2025-12-02 06:30:17', 480),
(3, 'visitor_1234567890_abc123', 3, '2025-12-02 06:40:17', 600),
(4, 'visitor_9876543210_xyz789', 1, '2025-12-02 07:20:17', 540),
(5, 'visitor_9876543210_xyz789', 2, '2025-12-02 07:30:17', 420);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`),
  ADD KEY `idx_bookings_phone` (`phone`),
  ADD KEY `idx_bookings_booking_id` (`booking_id`),
  ADD KEY `idx_bookings_status` (`status`),
  ADD KEY `idx_bookings_visit_date` (`visit_date`);

--
-- Indexes for table `factory_closures`
--
ALTER TABLE `factory_closures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `closure_date` (`closure_date`),
  ADD KEY `idx_factory_closures` (`closure_date`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_station` (`station_id`),
  ADD KEY `idx_media_type` (`media_type`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `station_number` (`station_number`),
  ADD KEY `idx_station_number` (`station_number`),
  ADD KEY `idx_station_category` (`category`),
  ADD KEY `idx_station_active` (`is_active`);

--
-- Indexes for table `tour_logs`
--
ALTER TABLE `tour_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tour_visitor` (`visitor_id`),
  ADD KEY `idx_tour_station` (`station_id`),
  ADD KEY `idx_tour_date` (`visited_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `factory_closures`
--
ALTER TABLE `factory_closures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3100;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tour_logs`
--
ALTER TABLE `tour_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_logs`
--
ALTER TABLE `tour_logs`
  ADD CONSTRAINT `tour_logs_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
