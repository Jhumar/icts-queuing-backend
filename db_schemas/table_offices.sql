CREATE TABLE IF NOT EXISTS `offices` (
  `uuid` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
);

-- Drop Window Columns
ALTER TABLE `windows` DROP `type`;
ALTER TABLE `windows` ADD `office_id` char(36) DEFAULT NULL AFTER `uuid`;