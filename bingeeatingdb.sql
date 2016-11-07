-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2016 at 10:17 PM
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
  `Username` varchar(50) NOT NULL,
  `SupporterId` varchar(254) NOT NULL,
  `AppointmentTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dailysummarysheet`
--

CREATE TABLE `dailysummarysheet` (
  `LogId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
('5f0b5ee0-a221-11e6-a7ee-35b310cb85dc', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 1, 0, 'Happy', 'Bored'),
('af402330-a223-11e6-ba33-5995d8779341', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 1, 0, 'Happy', 'Bored'),
('cf908cc0-a227-11e6-9e9c-cfdb7bb689e0', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 1, 0, 'Happy', 'Bored');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `MessageId` varchar(254) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `Label` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
('e3df5f30-a227-11e6-9e9c-cfdb7bb689e0', '39db7948-a1db-11e6-80f5-76304dec7eb7', '2016-11-01 11:53:06', 'Apple', 31);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` varchar(254) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Level` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `Username`, `Password`, `Role`, `Level`) VALUES
('39db7948-a1db-11e6-80f5-76304dec7eb7', 'P101', 'A4eVrsaoKu', '', 4),
('39db7cf4-a1db-11e6-80f5-76304dec7eb7', 'P102', 'G48avYORrH', '', 5),
('39db82c6-a1db-11e6-80f5-76304dec7eb7', 'P103', 'nE1NRz72lU', '', 1),
('39db8474-a1db-11e6-80f5-76304dec7eb7', 'P104', 'Xy2zGP9xjs', '', 4),
('39db8672-a1db-11e6-80f5-76304dec7eb7', 'P105', 'zwFcnfjwCF', '', 5),
('39db8802-a1db-11e6-80f5-76304dec7eb7', 'P106', '2vesBO9f9p', '', 1),
('39db8988-a1db-11e6-80f5-76304dec7eb7', 'P107', 'L2AuPknsYw', '', 5),
('39db8b22-a1db-11e6-80f5-76304dec7eb7', 'P108', '45v4wActzu', '', 4),
('39db9072-a1db-11e6-80f5-76304dec7eb7', 'P109', '6ZTEQLd1vu', '', 1),
('39db9220-a1db-11e6-80f5-76304dec7eb7', '1P10', 'lMka0ksE4i', '', 2),
('39db9388-a1db-11e6-80f5-76304dec7eb7', 'P111', 'BeBdcESXyl', '', 2),
('39db9554-a1db-11e6-80f5-76304dec7eb7', 'P112', 'XnIIl5oFmR', '', 1),
('39dba80a-a1db-11e6-80f5-76304dec7eb7', 'P113', '5OQOYlwEln', '', 3),
('39dbaaa8-a1db-11e6-80f5-76304dec7eb7', 'P114', 'nS8zrFLlGN', '', 3),
('39dbb12e-a1db-11e6-80f5-76304dec7eb7', 'P115', 'VgrNH9oXJt', '', 5),
('39dbb372-a1db-11e6-80f5-76304dec7eb7', 'P116', 'eYWv5MTqMb', '', 3),
('39dbb520-a1db-11e6-80f5-76304dec7eb7', 'P117', 'aeUzJUUrVD', '', 5),
('39dbb6e2-a1db-11e6-80f5-76304dec7eb7', 'P118', 'AhMgZ768mI', '', 5),
('39dbb89a-a1db-11e6-80f5-76304dec7eb7', 'P119', 'mUcGCdPwOC', '', 3),
('39dbba2a-a1db-11e6-80f5-76304dec7eb7', 'P120', 'mBLmDkB2AB', '', 3);

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
('5f1a0f70-a222-11e6-a7ee-35b310cb85dc', '39db7948-a1db-11e6-80f5-76304dec7eb7', 1, 1, 0, 0, 0, '');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `weeklysummarysheet`
--
ALTER TABLE `weeklysummarysheet`
  MODIFY `Week` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
