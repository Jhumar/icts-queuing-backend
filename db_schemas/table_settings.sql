CREATE TABLE IF NOT EXISTS `settings` (
  `uuid` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL
);

INSERT INTO `settings` (`uuid`, `name`, `value`) VALUES ('f8c001b9-d141-4537-ab4a-89e9af73f1a7', 'show_media', 'true');