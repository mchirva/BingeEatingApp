-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2016 at 10:39 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bingeeatingdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `AppointmentId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `SupporterId` varchar(254) NOT NULL,
  `AppointmentTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`AppointmentId`, `UserId`, `SupporterId`, `AppointmentTime`) VALUES
('65361f30-a78a-11e6-8130-1d5346d2293a', '39db7948-a1db-11e6-80f5-76304dec7eb7', '97f781d8-a759-11e6-80f5-76304dec7eb7', '2016-11-10 04:12:06'),
('960d0560-a78a-11e6-ab79-138efe64e82a', '39db7948-a1db-11e6-80f5-76304dec7eb7', '97f781d8-a759-11e6-80f5-76304dec7eb7', '2016-11-10 04:12:06'),
('b28c6690-a78a-11e6-8ace-af9307ecd998', '39db7948-a1db-11e6-80f5-76304dec7eb7', '97f781d8-a759-11e6-80f5-76304dec7eb7', '2016-11-10 04:12:06');

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `ChallengeId` int(11) NOT NULL,
  `Challenge` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`ChallengeId`, `Challenge`) VALUES
(1, 'Run for 30 mins!'),
(2, '50 Squats in half hour'),
(3, 'Walk 1 mile'),
(4, '15 push ups'),
(5, '10 sit ups, 15 sec plank'),
(6, 'Ride bycicle for 1 hour'),
(7, '25 crunches'),
(8, '15 sec arm circles'),
(9, '20 lunges'),
(10, '30 sec wall sit'),
(11, 'Swim for 30 mins'),
(12, 'Brisk walk 20 mins'),
(13, '10 sec side plank'),
(14, '25 jumping jacks'),
(15, '30 butt kicks'),
(16, '15 bycicle crunches'),
(17, '20 side lunges'),
(18, '15 leg lifts'),
(19, 'Slow Jog 30 mins'),
(20, '20 toe-touches'),
(21, '15 mins jog-in-place');

-- --------------------------------------------------------

--
-- Table structure for table `dailysummarysheet`
--

CREATE TABLE `dailysummarysheet` (
  `LogId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FoodOrDrinkConsumed` varchar(500) NOT NULL,
  `Binge` tinyint(4) NOT NULL,
  `VomitingOrLaxative` tinyint(4) NOT NULL,
  `ContextOrSetting` varchar(50) NOT NULL,
  `Feelings` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dailysummarysheet`
--

INSERT INTO `dailysummarysheet` (`LogId`, `UserId`, `Time`, `FoodOrDrinkConsumed`, `Binge`, `VomitingOrLaxative`, `ContextOrSetting`, `Feelings`) VALUES
('5f0b5ee0-a221-11e6-a7ee-35b310cb85dc', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 07:53:06', 'Apple', 1, 0, 'Happy', 'Bored'),
('8f4c88c0-a787-11e6-921e-b7b0196bd912', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-10 07:31:08', 'alcohol', 0, 1, 'At a party', 'dizzy'),
('af402330-a223-11e6-ba33-5995d8779341', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 07:53:06', 'Apple', 1, 0, 'Happy', 'Bored'),
('b2ee6410-a787-11e6-921e-b7b0196bd912', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-10 07:31:08', 'alcohol', 0, 1, 'At a party', 'dizzy'),
('cf908cc0-a227-11e6-9e9c-cfdb7bb689e0', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 07:53:06', 'Apple', 1, 0, 'Happy', 'Bored');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `MessageId` varchar(254) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `Label` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`MessageId`, `Message`, `Label`) VALUES
('86134734-a78d-11e6-80f5-76304dec7eb7', 'Well done!', 'Good'),
('86134a2c-a78d-11e6-80f5-76304dec7eb7', 'Good work!', 'Good'),
('86134c2a-a78d-11e6-80f5-76304dec7eb7', 'Awesome!', 'Good'),
('86134da6-a78d-11e6-80f5-76304dec7eb7', 'That''s great!', 'Good'),
('86134efa-a78d-11e6-80f5-76304dec7eb7', 'Wonderful!', 'Good'),
('8613549a-a78d-11e6-80f5-76304dec7eb7', 'You are amazing!', 'Good'),
('86135620-a78d-11e6-80f5-76304dec7eb7', 'Nicee!', 'Good'),
('86135788-a78d-11e6-80f5-76304dec7eb7', 'That was neat!', 'Good'),
('861358e6-a78d-11e6-80f5-76304dec7eb7', 'Yayyy!', 'Good'),
('86135a30-a78d-11e6-80f5-76304dec7eb7', 'Great job!', 'Good'),
('86135bb6-a78d-11e6-80f5-76304dec7eb7', 'Did you know? Binge can be bad for health!', 'Bad'),
('8613626e-a78d-11e6-80f5-76304dec7eb7', 'Well, better luck next time!', 'Bad'),
('86136430-a78d-11e6-80f5-76304dec7eb7', 'Time to improve!', 'Bad'),
('8613658e-a78d-11e6-80f5-76304dec7eb7', 'Would you let others binge?', 'Bad'),
('861366ec-a78d-11e6-80f5-76304dec7eb7', 'Would you let your friends self-induce vomiting?', 'Bad'),
('8613684a-a78d-11e6-80f5-76304dec7eb7', 'Info fact3', 'Random'),
('861369a8-a78d-11e6-80f5-76304dec7eb7', 'Info fact1', 'Random'),
('86136b1a-a78d-11e6-80f5-76304dec7eb7', 'Info fact2', 'Random'),
('86136fac-a78d-11e6-80f5-76304dec7eb7', 'Info fact4', 'Random'),
('86137128-a78d-11e6-80f5-76304dec7eb7', 'Info fact6', 'Random'),
('86137308-a78d-11e6-80f5-76304dec7eb7', 'Info fact7', 'Random');

-- --------------------------------------------------------

--
-- Table structure for table `motivationalmessage`
--

CREATE TABLE `motivationalmessage` (
  `MessageId` varchar(254) NOT NULL,
  `Message` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `physicaldailysummary`
--

CREATE TABLE `physicaldailysummary` (
  `LogId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PhysicalActivity` varchar(200) NOT NULL,
  `MinutesPerformed` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `physicaldailysummary`
--

INSERT INTO `physicaldailysummary` (`LogId`, `UserId`, `Time`, `PhysicalActivity`, `MinutesPerformed`) VALUES
('d9542650-a221-11e6-a7ee-35b310cb85dc', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 31),
('e3df5f30-a227-11e6-9e9c-cfdb7bb689e0', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 31),
('e3fe5ba0-a787-11e6-921e-b7b0196bd912', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-10 12:31:08', 'jogging', 40);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` varchar(254) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Level` tinyint(4) NOT NULL DEFAULT '0',
  `SupporterId` varchar(254) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `Username`, `Password`, `Role`, `Level`, `SupporterId`) VALUES
('39db7948-a1db-11e6-80f5-76304dec7eb7', 'P101', 'A4eVrsaoKu', 'Participant', 4, '97f781d8-a759-11e6-80f5-76304dec7eb7'),
('39db7cf4-a1db-11e6-80f5-76304dec7eb7', 'P102', 'G48avYORrH', 'Participant', 5, '97f7844e-a759-11e6-80f5-76304dec7eb7'),
('39db82c6-a1db-11e6-80f5-76304dec7eb7', 'P103', 'nE1NRz72lU', 'Participant', 1, '97f78552-a759-11e6-80f5-76304dec7eb7'),
('39db8474-a1db-11e6-80f5-76304dec7eb7', 'P104', 'Xy2zGP9xjs', 'Participant', 4, '97f78872-a759-11e6-80f5-76304dec7eb7'),
('39db8672-a1db-11e6-80f5-76304dec7eb7', 'P105', 'zwFcnfjwCF', 'Participant', 5, '97f781d8-a759-11e6-80f5-76304dec7eb7'),
('39db8802-a1db-11e6-80f5-76304dec7eb7', 'P106', '2vesBO9f9p', 'Participant', 1, '97f7844e-a759-11e6-80f5-76304dec7eb7'),
('39db8988-a1db-11e6-80f5-76304dec7eb7', 'P107', 'L2AuPknsYw', 'Participant', 5, '97f78552-a759-11e6-80f5-76304dec7eb7'),
('39db8b22-a1db-11e6-80f5-76304dec7eb7', 'P108', '45v4wActzu', 'Participant', 4, '97f78872-a759-11e6-80f5-76304dec7eb7'),
('39db9072-a1db-11e6-80f5-76304dec7eb7', 'P109', '6ZTEQLd1vu', 'Participant', 1, '97f781d8-a759-11e6-80f5-76304dec7eb7'),
('39db9220-a1db-11e6-80f5-76304dec7eb7', 'P110', 'lMka0ksE4i', 'Participant', 2, '97f7844e-a759-11e6-80f5-76304dec7eb7'),
('39db9388-a1db-11e6-80f5-76304dec7eb7', 'P111', 'BeBdcESXyl', 'Participant', 2, '97f78552-a759-11e6-80f5-76304dec7eb7'),
('39db9554-a1db-11e6-80f5-76304dec7eb7', 'P112', 'XnIIl5oFmR', 'Participant', 1, '97f78872-a759-11e6-80f5-76304dec7eb7'),
('39dba80a-a1db-11e6-80f5-76304dec7eb7', 'P113', '5OQOYlwEln', 'Participant', 3, '97f781d8-a759-11e6-80f5-76304dec7eb7'),
('39dbaaa8-a1db-11e6-80f5-76304dec7eb7', 'P114', 'nS8zrFLlGN', 'Participant', 3, '97f7844e-a759-11e6-80f5-76304dec7eb7'),
('39dbb12e-a1db-11e6-80f5-76304dec7eb7', 'P115', 'VgrNH9oXJt', 'Participant', 5, '97f78552-a759-11e6-80f5-76304dec7eb7'),
('39dbb372-a1db-11e6-80f5-76304dec7eb7', 'P116', 'eYWv5MTqMb', 'Participant', 3, '97f78872-a759-11e6-80f5-76304dec7eb7'),
('39dbb520-a1db-11e6-80f5-76304dec7eb7', 'P117', 'aeUzJUUrVD', 'Participant', 5, '97f781d8-a759-11e6-80f5-76304dec7eb7'),
('39dbb6e2-a1db-11e6-80f5-76304dec7eb7', 'P118', 'AhMgZ768mI', 'Participant', 5, '97f7844e-a759-11e6-80f5-76304dec7eb7'),
('39dbb89a-a1db-11e6-80f5-76304dec7eb7', 'P119', 'mUcGCdPwOC', 'Participant', 3, '97f78552-a759-11e6-80f5-76304dec7eb7'),
('39dbba2a-a1db-11e6-80f5-76304dec7eb7', 'P120', 'mBLmDkB2AB', 'Participant', 3, '97f78872-a759-11e6-80f5-76304dec7eb7'),
('97f781d8-a759-11e6-80f5-76304dec7eb7', 'S101', 'QXJkCxtD', 'Supporter', 0, ''),
('97f7844e-a759-11e6-80f5-76304dec7eb7', 'S103', 'ZKGBOcWF', 'Supporter', 0, ''),
('97f78552-a759-11e6-80f5-76304dec7eb7', 'S102', 'ZKGBOcWF', 'Supporter', 0, ''),
('97f78872-a759-11e6-80f5-76304dec7eb7', 'S104', 'QXJkCxtD', 'Supporter', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `weeklysummarysheet`
--

CREATE TABLE `weeklysummarysheet` (
  `LogId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `Week` tinyint(4) NOT NULL,
  `Binges` tinyint(4) NOT NULL,
  `VLD` tinyint(4) NOT NULL,
  `FruitVegetableServings` tinyint(4) NOT NULL,
  `PhysicalActivity` tinyint(4) NOT NULL,
  `Events` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `weeklysummarysheet`
--

INSERT INTO `weeklysummarysheet` (`LogId`, `UserId`, `Week`, `Binges`, `VLD`, `FruitVegetableServings`, `PhysicalActivity`, `Events`) VALUES
('130d4290-a223-11e6-93ae-87f9ca4a9b1b', '39db7948-a1db-11e6-80f5-76304dec7eb7', 2, 3, 2, 4, 1, 'Nothing!'),
('5f1a0f70-a222-11e6-a7ee-35b310cb85dc', '39db7948-a1db-11e6-80f5-76304dec7eb7', 1, 1, 0, 0, 0, ''),
('86b5efc0-a788-11e6-921e-b7b0196bd912', '39db7948-a1db-11e6-80f5-76304dec7eb7', 3, 0, 2, 0, 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`AppointmentId`);

--
-- Indexes for table `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`ChallengeId`);

--
-- Indexes for table `dailysummarysheet`
--
ALTER TABLE `dailysummarysheet`
  ADD PRIMARY KEY (`LogId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`MessageId`);

--
-- Indexes for table `motivationalmessage`
--
ALTER TABLE `motivationalmessage`
  ADD PRIMARY KEY (`MessageId`);

--
-- Indexes for table `physicaldailysummary`
--
ALTER TABLE `physicaldailysummary`
  ADD PRIMARY KEY (`LogId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `weeklysummarysheet`
--
ALTER TABLE `weeklysummarysheet`
  ADD PRIMARY KEY (`LogId`),
  ADD UNIQUE KEY `Week` (`Week`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `challenges`
--
ALTER TABLE `challenges`
  MODIFY `ChallengeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `weeklysummarysheet`
--
ALTER TABLE `weeklysummarysheet`
  MODIFY `Week` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
