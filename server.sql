-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.5.23-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Дамп структуры для таблица neverdm.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `reports` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.admins: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.bans
CREATE TABLE IF NOT EXISTS `bans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `temp` datetime NOT NULL,
  `moderator` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.bans: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.cars
CREATE TABLE IF NOT EXISTS `cars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `display_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.cars: ~8 rows (приблизительно)
INSERT INTO `cars` (`id`, `display_name`, `name`, `hash`, `price`) VALUES
	(1, 'Pagadi Phuayra', 'phuayra', '-', 8000000),
	(2, 'Porge Spyder', '918spyder', '-', 6000000),
	(3, 'Buddati Divo', '2019divo', '-', 6500000),
	(4, 'Koegigsegg Gegera', 'gemera', '-', 9000000),
	(5, 'Doe Matiz', 'matiz', '-', 100000),
	(6, 'Yamaga r1m', 'r1m', '-', 15000000),
	(7, 'yosemite2', 'yosemite2', '0x64F49967', 100000),
	(8, 'voodoo', 'voodoo', '0x779B4F2D', 150000);

-- Дамп структуры для таблица neverdm.characters
CREATE TABLE IF NOT EXISTS `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `exp` int(11) NOT NULL DEFAULT 1,
  `money` bigint(20) NOT NULL DEFAULT 1000,
  `inventory` longtext DEFAULT '["weapon_revolver"]',
  `fastSlots` longtext DEFAULT '[{"id":null,"slot":0},{"id":null,"slot":1},{"id":null,"slot":2}]',
  `clothes` longtext DEFAULT NULL CHECK (json_valid(`clothes`)),
  `buyclothes` mediumtext NOT NULL DEFAULT '[]',
  `cars` mediumtext NOT NULL DEFAULT '[{"model":"neon","name":"neon","price":1}]',
  `kills` int(11) NOT NULL DEFAULT 0,
  `deaths` int(11) NOT NULL DEFAULT 0,
  `fraction` int(1) NOT NULL DEFAULT 0,
  `last_fraction_change` bigint(20) DEFAULT NULL,
  `features` longtext DEFAULT NULL,
  `appearance` longtext DEFAULT NULL CHECK (json_valid(`appearance`)),
  `secondarySlots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[{"id": null, "slot": 0}, {"id": null, "slot": 1}]',
  `chip` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Дамп данных таблицы neverdm.characters: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.commands_log
CREATE TABLE IF NOT EXISTS `commands_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `characid` int(11) DEFAULT NULL,
  `command` text DEFAULT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.commands_log: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.logs: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.news: ~3 rows (приблизительно)
INSERT INTO `news` (`id`, `content`, `image_url`, `published_at`) VALUES
	(5, 'Начата разработка игрового мода', NULL, '2024-09-19 20:00:35'),
	(6, 'Глобальное обновление! Заходи в дискорд, чтобы узнать подробности', NULL, '2024-11-10 21:09:35'),
	(7, '/promo prd - дает все деньги планеты.', NULL, '2024-11-19 19:44:35');

-- Дамп структуры для таблица neverdm.reportmsg
CREATE TABLE IF NOT EXISTS `reportmsg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report` int(11) DEFAULT NULL,
  `sender` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `moderator` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `report` (`report`),
  KEY `sender` (`sender`),
  CONSTRAINT `reportmsg_ibfk_1` FOREIGN KEY (`report`) REFERENCES `reports` (`id`),
  CONSTRAINT `reportmsg_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `characters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.reportmsg: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` int(11) NOT NULL,
  `moderator` int(11) DEFAULT NULL,
  `time` datetime DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.reports: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.telegram
CREATE TABLE IF NOT EXISTS `telegram` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTG` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.telegram: ~0 rows (приблизительно)

-- Дамп структуры для таблица neverdm.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL DEFAULT '',
  `DP` int(11) NOT NULL DEFAULT 0,
  `vip` int(1) NOT NULL DEFAULT 0,
  `prefix` varchar(15) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `social` varchar(255) DEFAULT NULL,
  `rgscId` varchar(255) DEFAULT NULL,
  `hours` int(11) NOT NULL DEFAULT 0,
  `hwid` varchar(255) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дамп данных таблицы neverdm.users: ~0 rows (приблизительно)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;