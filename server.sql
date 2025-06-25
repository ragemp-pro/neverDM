-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 25 2025 г., 16:15
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `server`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `reports` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `bans`
--

CREATE TABLE `bans` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `temp` datetime NOT NULL,
  `moderator` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Дамп данных таблицы `cars`
--

INSERT INTO `cars` (`id`, `display_name`, `name`, `hash`, `price`) VALUES
(1, 'Pagadi Phuayra', 'phuayra', '-', 8000000),
(2, 'Porge Spyder', '918spyder', '-', 6000000),
(3, 'Buddati Divo', '2019divo', '-', 6500000),
(4, 'Koegigsegg Gegera', 'gemera', '-', 9000000),
(5, 'Doe Matiz', 'matiz', '-', 100000),
(6, 'Yamaga r1m', 'r1m', '-', 15000000),
(7, 'yosemite2', 'yosemite2', '0x64F49967', 100000),
(8, 'voodoo', 'voodoo', '0x779B4F2D', 150000);

-- --------------------------------------------------------

--
-- Структура таблицы `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
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
  `kills` int(11) NOT NULL,
  `deaths` int(11) NOT NULL,
  `fraction` int(1) NOT NULL,
  `last_fraction_change` bigint(20) DEFAULT NULL,
  `features` longtext DEFAULT NULL,
  `appearance` longtext DEFAULT NULL CHECK (json_valid(`appearance`)),
  `secondarySlots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[{"id": null, "slot": 0}, {"id": null, "slot": 1}]',
  `chip` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `characters`
--

INSERT INTO `characters` (`id`, `user`, `name`, `surname`, `level`, `exp`, `money`, `inventory`, `fastSlots`, `clothes`, `buyclothes`, `cars`, `kills`, `deaths`, `fraction`, `last_fraction_change`, `features`, `appearance`, `secondarySlots`, `chip`) VALUES
(50, 23, 'SS', 'SS', 1, 1, 1000, '[\"weapon_revolver\"]', '[{\"id\":null,\"slot\":0},{\"id\":null,\"slot\":1},{\"id\":null,\"slot\":2}]', '[{\"component\":2,\"drawable\":0,\"texture\":0},{\"component\":11,\"drawable\":7,\"texture\":1},{\"component\":4,\"drawable\":5,\"texture\":1},{\"component\":6,\"drawable\":32,\"texture\":1}]', '[]', '[{\"model\":\"neon\",\"name\":\"neon\",\"price\":1}]', 0, 0, 2, 1750860155735, '{}', '{\"brows\":{\"style\":-1,\"color\":0},\"beard\":{\"style\":-1,\"color\":0},\"makeup\":{\"style\":-1,\"color\":0}}', '[{\"id\": null, \"slot\": 0}, {\"id\": null, \"slot\": 1}]', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `commands_log`
--

CREATE TABLE `commands_log` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `characid` int(11) DEFAULT NULL,
  `command` text DEFAULT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `news`
--

INSERT INTO `news` (`id`, `content`, `image_url`, `published_at`) VALUES
(5, 'Начата разработка игрового мода', NULL, '2024-09-19 20:00:35'),
(6, 'Глобальное обновление! Заходи в дискорд, чтобы узнать подробности', NULL, '2024-11-10 21:09:35'),
(7, '/promo prd - дает все деньги планеты.', NULL, '2024-11-19 19:44:35');

-- --------------------------------------------------------

--
-- Структура таблицы `reportmsg`
--

CREATE TABLE `reportmsg` (
  `id` int(11) NOT NULL,
  `report` int(11) DEFAULT NULL,
  `sender` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `moderator` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `creator` int(11) NOT NULL,
  `moderator` int(11) DEFAULT NULL,
  `time` datetime DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `telegram`
--

CREATE TABLE `telegram` (
  `id` int(11) NOT NULL,
  `idTG` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL,
  `DP` int(11) NOT NULL,
  `vip` int(1) NOT NULL,
  `prefix` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `social` varchar(255) DEFAULT NULL,
  `rgscId` varchar(255) DEFAULT NULL,
  `hours` int(11) NOT NULL,
  `hwid` varchar(255) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `telegram`, `DP`, `vip`, `prefix`, `ip`, `social`, `rgscId`, `hours`, `hwid`, `last_ip`, `created_at`, `updated_at`) VALUES
(23, 'sys', 'ssss@ss.ss', '$2b$10$0VP2DZZW0Yy29a2TH7jWUOr/quIyAyRYoq4.D0aph9RjJhJdwNSsS', '', 0, 0, NULL, '127.0.0.1', 'ounezz', '261673942', 0, 'C87A2850601E2620687281A4BA9AE370484AA890606EC660E8C2B1D4DA4AB3E0C81A28D060BE66A06812E104FAFA835048EAA810600E06E0E86211341AAA53C0', '127.0.0.1', '2025-06-25 19:02:03', '2025-06-25 14:11:07');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Индексы таблицы `bans`
--
ALTER TABLE `bans`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Индексы таблицы `commands_log`
--
ALTER TABLE `commands_log`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reportmsg`
--
ALTER TABLE `reportmsg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report` (`report`),
  ADD KEY `sender` (`sender`);

--
-- Индексы таблицы `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `telegram`
--
ALTER TABLE `telegram`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `bans`
--
ALTER TABLE `bans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT для таблицы `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT для таблицы `commands_log`
--
ALTER TABLE `commands_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=653;

--
-- AUTO_INCREMENT для таблицы `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `reportmsg`
--
ALTER TABLE `reportmsg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT для таблицы `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT для таблицы `telegram`
--
ALTER TABLE `telegram`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `characters`
--
ALTER TABLE `characters`
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reportmsg`
--
ALTER TABLE `reportmsg`
  ADD CONSTRAINT `reportmsg_ibfk_1` FOREIGN KEY (`report`) REFERENCES `reports` (`id`),
  ADD CONSTRAINT `reportmsg_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `characters` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
