-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2016 at 08:55 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser` (IN `username` CHAR(200), IN `role` CHAR(50), IN `supporterid` CHAR(254), IN `messages` INT, IN `imagetagging` INT, IN `createdate` DATETIME, IN `password` VARCHAR(200), IN `salt` VARCHAR(16))  BEGIN

	DECLARE supporter CHAR(254);
    IF role = 'Participant' THEN
    SET supporter = (SELECT users.UserId FROM users WHERE users.SupporterId = supporterid);
    ELSE SET supporter = supporterid;
    END IF;
   
	INSERT INTO users (users.UserId, users.Username, users.HashedPassword, users.Salt, users.Role, users.SupporterId, users.Messages, users.ImageTagging, users.CreateDateTime)
    VALUES (UUID(), username, passwordd, salt, role, supporter, messages, imagetagging, createdate);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `postDailyLog` (IN `logid` CHAR(254), IN `userid` CHAR(254), IN `logtime` DATETIME, IN `food` CHAR(200), IN `fv` INT, IN `binge` INT, IN `vl` INT, IN `cs` TEXT, IN `feelings` TEXT, IN `image` TEXT, IN `newimage` INT)  BEGIN
	DECLARE urlid CHAR(254);
	IF logid = '' THEN
    	IF image = '' THEN
    		INSERT INTO dailysummarysheet (dailysummarysheet.LogId, dailysummarysheet.UserId, dailysummarysheet.Time, dailysummarysheet.FoodOrDrinkConsumed, dailysummarysheet.FVNumberOfServings, dailysummarysheet.Binge, dailysummarysheet.VomitingOrLaxative, dailysummarysheet.ContextOrSetting, dailysummarysheet.Feelings, dailysummarysheet.ImageId) VALUES (UUID(), userid, logtime, food, fv, binge, vl, cs, feelings, image);
        ELSE        	
            SET urlid = UUID();
        	INSERT INTO images (images.ImageId, images.ImageUrl) VALUES (urlid, image);
            INSERT INTO dailysummarysheet (dailysummarysheet.LogId, dailysummarysheet.UserId, dailysummarysheet.Time, dailysummarysheet.FoodOrDrinkConsumed, dailysummarysheet.FVNumberOfServings, dailysummarysheet.Binge, dailysummarysheet.VomitingOrLaxative, dailysummarysheet.ContextOrSetting, dailysummarysheet.Feelings, dailysummarysheet.ImageId) VALUES (UUID(), userid, logtime, food, fv, binge, vl, cs, feelings, urlid);
        END IF;
    ELSE 
    	IF image = '' THEN
    		UPDATE dailysummarysheet SET dailysummarysheet.Time = time, dailysummarysheet.FoodOrDrinkConsumed = food, dailysummarysheet.FVNumberOfServings = fv, dailysummarysheet.Binge = binge, dailysummarysheet.VomitingOrLaxative = vl, dailysummarysheet.ContextOrSetting = cs, dailysummarysheet.Feelings = feelings, dailysummarysheet.ImageId = image WHERE dailysummarysheet.LogId = logid;
        ELSE
        	IF newimage = 1 THEN
            	SET urlid = (SELECT dailysummarysheet.ImageId FROM dailysummarysheet WHERE dailysummarysheet.LogId = logid);
            	UPDATE dailysummarysheet SET dailysummarysheet.ImageId = '', dailysummarysheet.ImageTag = '' WHERE dailysummarysheet.LogId = logid;
                DELETE FROM imagetags WHERE imagetags.ImageId = urlid;
                DELETE FROM images WHERE images.ImageId = urlid;
            END IF;
            SET urlid = UUID();
            INSERT INTO images (images.ImageId, images.ImageUrl) VALUES (urlid, image);
            UPDATE dailysummarysheet SET dailysummarysheet.ImageId = urlid WHERE dailysummarysheet.LogId = logid;
        END IF;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `replaceAndDeleteSupporter` (IN `oldEmail` CHAR(254), IN `newEmail` CHAR(254))  BEGIN
   DECLARE oldsupporterId CHAR(124);
   DECLARE newsupporterId CHAR(124);
   SET oldsupporterId = (SELECT users.UserId FROm users WHERE users.SupporterId = oldEmail);
   SET newsupporterId = (SELECT users.UserId FROm users WHERE users.SupporterId = newEmail);

   UPDATE users SET users.SupporterId = newsupporterId WHERE users.SupporterId = oldsupporterId;
   
   DELETE FROM users WHERE users.UserId = oldsupporterId;
END$$

DELIMITER ;

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

-- --------------------------------------------------------

--
-- Table structure for table `dailysummarysheet`
--

CREATE TABLE `dailysummarysheet` (
  `LogId` varchar(254) NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FoodOrDrinkConsumed` varchar(500) NOT NULL,
  `FVNumberOfServings` int(11) NOT NULL,
  `Binge` tinyint(4) NOT NULL,
  `VomitingOrLaxative` tinyint(4) NOT NULL,
  `ContextOrSetting` varchar(50) NOT NULL,
  `Feelings` varchar(500) NOT NULL,
  `ImageId` varchar(254) DEFAULT NULL,
  `ImageTag` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `ImageId` varchar(254) NOT NULL,
  `ImageUrl` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `imagetags`
--

CREATE TABLE `imagetags` (
  `ImageId` varchar(254) NOT NULL,
  `TagId` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Triggers `imagetags`
--
DELIMITER $$
CREATE TRIGGER `updateTag` AFTER INSERT ON `imagetags` FOR EACH ROW BEGIN
UPDATE dailysummarysheet SET dailysummarysheet.ImageTag =
(SELECT imagetags.TagId 
FROM imagetags 
WHERE imagetags.ImageId = NEW.ImageId
GROUP BY imagetags.TagId 
ORDER BY count(*) DESC
LIMIT 1)
WHERE dailysummarysheet.ImageId = NEW.ImageId;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `MessageId` varchar(254) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `Label` varchar(10) NOT NULL,
  `Step` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `Id` varchar(254) NOT NULL,
  `Notes` mediumtext NOT NULL,
  `UserId` varchar(254) NOT NULL,
  `IsVisible` tinyint(4) NOT NULL
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

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `QuestionId` varchar(254) NOT NULL,
  `Question` varchar(2000) NOT NULL,
  `Options` varchar(200) NOT NULL,
  `Answer` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`QuestionId`, `Question`, `Options`, `Answer`) VALUES
('6fd2bf-0e50-4ee6-bf5b-4ed699809631', 'How many hours should be left between planned meals and snacks?', '{a: zero, b: three, c: five, d: six} ', 'b'),
('acf3881c-96d8-45f7-8642-5981ad9074f5', 'We should avoid eating between meals unless a snack is included in the meal plan.', '{a: true, b: false}', 'b'),
('ef53ce46-720d-4ccc-9588-ac772416de95', 'How many well balanced meals per day should we eat?', '{a: zero, b: three, c: five, d: six}', 'b'),
('11fab281-25ab-4699-9ae0-107f9fa11155', 'We should eat same amount of food at the same time every day', '{a: true, b: false}', 'a'),
('4cbfe607-058c-4c76-b6f0-090d757f3481', 'Do not skip meals or snacks.', '{a: true, b: false}', 'a'),
('0b3fa1fe-2c02-4fb7-8667-b24f33a1c6b4', 'How many cups of fluids should we consume daily?', '{a: 2-3, b: 5-6, c: 10-11, d: 0-1}', 'b');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `TagId` varchar(254) NOT NULL,
  `Tag` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`TagId`, `Tag`) VALUES
('09d44cca-bfcc-11e6-a4a6-cec0c932ce01', 'Fruit'),
('09d4526a-bfcc-11e6-a4a6-cec0c932ce01', 'Vegetable'),
('09d45382-bfcc-11e6-a4a6-cec0c932ce01', 'Dessert'),
('09d4545e-bfcc-11e6-a4a6-cec0c932ce01', 'Processed food'),
('09d45530-bfcc-11e6-a4a6-cec0c932ce01', 'Meat'),
('09d455f8-bfcc-11e6-a4a6-cec0c932ce01', 'Cereal'),
('09d456c0-bfcc-11e6-a4a6-cec0c932ce01', 'Bread'),
('09d45788-bfcc-11e6-a4a6-cec0c932ce01', 'Salad'),
('09d45b70-bfcc-11e6-a4a6-cec0c932ce01', 'Soup'),
('09d45c4c-bfcc-11e6-a4a6-cec0c932ce01', 'Pasta'),
('09d45d14-bfcc-11e6-a4a6-cec0c932ce01', 'Pizza'),
('09d45ddc-bfcc-11e6-a4a6-cec0c932ce01', 'Noodles'),
('09d45ea4-bfcc-11e6-a4a6-cec0c932ce01', 'Rice'),
('09d45f6c-bfcc-11e6-a4a6-cec0c932ce01', 'Fried food'),
('ad21d72c-bfd0-11e6-a4a6-cec0c932ce01', 'Dairy Products'),
('ad21d9fc-bfd0-11e6-a4a6-cec0c932ce01', 'Nuts');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` varchar(254) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `HashedPassword` varchar(200) NOT NULL,
  `Salt` varchar(17) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Level` tinyint(4) NOT NULL DEFAULT '0',
  `SupporterId` varchar(254) DEFAULT NULL,
  `Score` int(11) NOT NULL,
  `Messages` tinyint(4) NOT NULL,
  `ImageTagging` tinyint(4) NOT NULL,
  `CreateDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `Username`, `HashedPassword`, `Salt`, `Role`, `Level`, `SupporterId`, `Score`, `Messages`, `ImageTagging`, `CreateDateTime`) VALUES
('8e3e996e-d4a7-46eb-80c9-e939468b75fa', 'Admin', 'e8281346fad3577aec5af5f0827145c52383547ecc2e22eeaf629110fc217ce04b48775ac8cbed4817f5f168a3d415cdb6fac56502e1d14ef55c40b460bd1f47', '0ce1c0602101019d', 'Admin', 0, 'admin@gmail.com', 0, 0, 0, '2016-12-15 14:44:00');

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
  `Weight` float NOT NULL,
  `Events` varchar(1000) NOT NULL,
  `GoodDays` int(11) NOT NULL,
  `CreatedDateTime` datetime NOT NULL,
  `UpdatedDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`AppointmentId`);

--
-- Indexes for table `dailysummarysheet`
--
ALTER TABLE `dailysummarysheet`
  ADD PRIMARY KEY (`LogId`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ImageId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`MessageId`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `physicaldailysummary`
--
ALTER TABLE `physicaldailysummary`
  ADD PRIMARY KEY (`LogId`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`TagId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- Indexes for table `weeklysummarysheet`
--
ALTER TABLE `weeklysummarysheet`
  ADD PRIMARY KEY (`LogId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
