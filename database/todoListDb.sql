-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2024 at 02:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todolistdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `key_results`
--

CREATE TABLE `key_results` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `key_results`
--

INSERT INTO `key_results` (`id`, `task_id`, `task_name`, `time`) VALUES
(98, 76, 'Wake up early', '07:00:00'),
(99, 76, 'Exercise', '07:30:00'),
(100, 76, 'Shower and get dressed', '08:00:00'),
(101, 77, 'Attend team meeting', '09:00:00'),
(102, 77, 'Complete project report', '11:00:00'),
(103, 77, 'Reply to emails', '12:00:00'),
(104, 78, 'Have lunch', '12:30:00'),
(105, 78, 'Go for a short walk', '13:00:00'),
(106, 79, 'Prepare presentation', '14:00:00'),
(107, 79, 'Meeting with client', '15:30:00'),
(108, 80, 'Cook dinner', '18:00:00'),
(109, 80, 'Family time', '19:00:00'),
(110, 80, 'Prepare for tomorrow', '20:30:00'),
(111, 81, 'Cook dinner', '19:10:00'),
(112, 81, 'Family time', '20:14:00');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_title` varchar(255) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `task_title`, `task_name`, `time`, `created_at`) VALUES
(76, 'Morning Routine', '', '00:00:00', '2024-10-14 16:45:32'),
(77, 'Work Tasks', '', '00:00:00', '2024-10-14 16:45:56'),
(78, 'Lunch Break', '', '00:00:00', '2024-10-14 16:46:03'),
(79, 'Afternoon Tasks', '', '00:00:00', '2024-10-14 16:46:09'),
(80, 'Evening Routine', '', '00:00:00', '2024-10-14 16:46:14'),
(81, 'Evening Routine', '', '00:00:00', '2024-10-14 16:58:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `key_results`
--
ALTER TABLE `key_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `key_results`
--
ALTER TABLE `key_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `key_results`
--
ALTER TABLE `key_results`
  ADD CONSTRAINT `key_results_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
