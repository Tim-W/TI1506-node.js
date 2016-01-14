-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Gegenereerd op: 14 jan 2016 om 13:23
-- Serverversie: 5.6.27
-- PHP-versie: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ItemTag`
--

CREATE TABLE `ItemTag` (
  `ToDoId` int(11) NOT NULL,
  `TagId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `ItemTag`
--

INSERT INTO `ItemTag` (`ToDoId`, `TagId`) VALUES
(1, 1),
(2, 1),
(3, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(12, 2),
(13, 2),
(14, 2),
(1, 3),
(2, 3),
(3, 3),
(17, 3),
(18, 3),
(19, 3),
(20, 3),
(22, 3),
(23, 3),
(24, 3),
(25, 3),
(12, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(21, 5);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `Tag`
--

CREATE TABLE `Tag` (
  `Id` int(11) NOT NULL,
  `Text` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `Tag`
--

INSERT INTO `Tag` (`Id`, `Text`) VALUES
(1, 'webdata'),
(2, 'sport'),
(3, 'school'),
(4, 'work'),
(5, 'personal');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ToDoAssignment`
--

CREATE TABLE `ToDoAssignment` (
  `ToDoId` int(11) NOT NULL,
  `AssigneeId` bigint(30) NOT NULL,
  `AssignDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ToDoItem`
--

CREATE TABLE `ToDoItem` (
  `Id` int(11) NOT NULL,
  `Title` text,
  `Text` text,
  `CreationDate` timestamp NULL DEFAULT NULL,
  `DueDate` timestamp NULL DEFAULT NULL,
  `Completed` tinyint(1) DEFAULT NULL,
  `CompletionDate` timestamp NULL DEFAULT NULL,
  `Priority` int(11) NOT NULL,
  `ToDoListID` int(11) DEFAULT NULL,
  `ParentToDo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `ToDoItem`
--

INSERT INTO `ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES
(1, 'Do assignment 1', 'Finish assignment one before the assessment time', '2014-11-17 11:56:12', '2014-11-20 22:59:59', 0, '2014-11-20 22:55:15', 3, 1, NULL),
(2, 'Do telnet exercises', 'Do all telnet exercises and understand what is happening and why', '2014-11-18 21:51:48', '2014-11-20 22:59:59', 0, NULL, 3, 1, 1),
(3, 'No description', 'Do the html part of the first assignment: code and design', '2014-11-18 14:26:58', '2015-12-17 17:18:43', 0, '2014-11-19 14:59:36', 1, 1, 1),
(12, 'Leg day', 'Go to the gym', '2014-11-17 11:55:36', '2014-11-24 14:00:00', 1, '2014-11-24 14:05:56', 1, 4, NULL),
(13, 'Exercise', 'Cycle 50 kms', '2014-11-20 13:52:45', '2014-11-27 15:00:00', 0, NULL, 1, 4, NULL),
(14, 'Exercise', 'Run 10k', '2014-11-24 17:55:00', '2014-11-30 23:00:00', 0, NULL, 1, 4, NULL),
(15, 'Celebrate birthday', 'With all my friends!', '2014-11-02 17:25:44', '2014-12-24 22:59:59', 0, NULL, 3, 4, NULL),
(16, 'Visit grandma', 'Don''t forget to bring a little present', '2014-05-14 09:52:44', '2014-05-22 13:00:00', 1, '2014-05-22 15:11:25', 2, 4, NULL),
(17, 'Assignment 2', 'Fix all parts of assignment 2 for webdata', '2014-11-25 11:22:45', '2015-12-17 17:18:47', 0, '2014-11-27 11:52:33', 1, 1, NULL),
(18, 'First part of 2', 'Do the first part of the second assignment', '2014-11-25 11:23:15', '2014-11-27 14:45:00', 1, '2014-11-26 08:12:52', 3, 1, 17),
(19, 'Second part of 2', 'Do the second part of the second assignment', '2014-11-25 11:25:55', '2014-11-27 14:45:00', 1, '2014-11-27 11:52:33', 3, 1, 17),
(20, 'Learn for Midterm', 'For webdata midterm', '2014-12-01 13:55:32', '2014-12-09 08:00:00', 1, '2014-11-08 21:55:15', 1, 1, NULL),
(21, 'Vacuum', 'in my room', '2014-11-22 11:55:22', '2014-11-27 11:00:00', 1, '2014-11-25 14:44:22', 1, 4, NULL),
(22, 'Assigment 3 and 4', 'For webdata', '2014-12-02 15:11:25', '2014-12-18 11:00:00', 0, NULL, 3, 1, NULL),
(23, 'Assignemnt 3 part 1 ', 'part 1 for A3', '2014-12-02 15:12:11', '2014-12-18 11:00:00', 1, '2014-12-14 11:55:34', 3, 1, 22),
(24, 'Assignment 3 part 2', 'part 2 for A3', '2014-12-02 15:12:55', '2014-12-18 11:00:00', 1, '2014-12-14 17:32:56', 3, 1, 22),
(25, 'Assignment 4 part 1', 'part 1 for A4', '2014-12-02 15:14:25', '2014-12-18 11:00:00', 1, '2014-12-16 12:25:56', 3, 1, 22),
(29, 'Play HotS', 'Play Freaking heroes of the storm', '2015-12-17 20:40:07', '2015-12-18 20:40:09', 0, NULL, 0, 5, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ToDoList`
--

CREATE TABLE `ToDoList` (
  `Id` int(11) NOT NULL,
  `Name` text,
  `CreationDate` timestamp NULL DEFAULT NULL,
  `Owner` bigint(30) DEFAULT NULL,
  `IsPublic` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `ToDoList`
--

INSERT INTO `ToDoList` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES
(1, 'Universiteit', '2013-01-25 11:35:00', 1, 0),
(4, 'Personal', '2014-10-21 22:00:00', 2, 0),
(5, 'Werk', '2013-01-25 11:35:00', 1, 0);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `User`
--

CREATE TABLE `User` (
  `Id` bigint(30) NOT NULL,
  `Name` text,
  `Email` text,
  `Username` tinytext,
  `Password` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `User`
--

INSERT INTO `User` (`Id`, `Name`, `Email`, `Username`, `Password`) VALUES
(1, 'user1', 'user1@to.do', 'user1', 'pass1'),
(2, 'user2', 'user2@to.do', 'user2', 'pass2'),
(811021852342073, 'undefined', 'default email', 'default username', 'default password');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `ItemTag`
--
ALTER TABLE `ItemTag`
  ADD PRIMARY KEY (`ToDoId`,`TagId`),
  ADD KEY `tag_id_idx` (`TagId`);

--
-- Indexen voor tabel `Tag`
--
ALTER TABLE `Tag`
  ADD PRIMARY KEY (`Id`);

--
-- Indexen voor tabel `ToDoAssignment`
--
ALTER TABLE `ToDoAssignment`
  ADD PRIMARY KEY (`ToDoId`,`AssigneeId`),
  ADD KEY `assignee_id_idx` (`AssigneeId`);

--
-- Indexen voor tabel `ToDoItem`
--
ALTER TABLE `ToDoItem`
  ADD PRIMARY KEY (`Id`,`Priority`),
  ADD KEY `item_list_idx` (`ToDoListID`),
  ADD KEY `parent_child_idx` (`ParentToDo`);

--
-- Indexen voor tabel `ToDoList`
--
ALTER TABLE `ToDoList`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `list_owner_idx` (`Owner`);

--
-- Indexen voor tabel `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `Tag`
--
ALTER TABLE `Tag`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT voor een tabel `ToDoAssignment`
--
ALTER TABLE `ToDoAssignment`
  MODIFY `ToDoId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `ToDoItem`
--
ALTER TABLE `ToDoItem`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT voor een tabel `ToDoList`
--
ALTER TABLE `ToDoList`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT voor een tabel `User`
--
ALTER TABLE `User`
  MODIFY `Id` bigint(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=811021852342074;
--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `ItemTag`
--
ALTER TABLE `ItemTag`
  ADD CONSTRAINT `tag_tag` FOREIGN KEY (`TagId`) REFERENCES `Tag` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tag_todo` FOREIGN KEY (`ToDoId`) REFERENCES `ToDoItem` (`Id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `ToDoAssignment`
--
ALTER TABLE `ToDoAssignment`
  ADD CONSTRAINT `assignment_assignee` FOREIGN KEY (`AssigneeId`) REFERENCES `User` (`Id`),
  ADD CONSTRAINT `assingment_todo` FOREIGN KEY (`ToDoId`) REFERENCES `ToDoItem` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `ToDoItem`
--
ALTER TABLE `ToDoItem`
  ADD CONSTRAINT `item_list` FOREIGN KEY (`ToDoListID`) REFERENCES `ToDoList` (`Id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `ToDoList`
--
ALTER TABLE `ToDoList`
  ADD CONSTRAINT `list_owner` FOREIGN KEY (`Owner`) REFERENCES `User` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
