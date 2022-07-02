DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uuid` char(36) not null primary key,
  `first_name` varchar(64) default null,
  `last_name` varchar(64) default null,
  `sex` enum('MALE', 'FEMALE') default null,
  `employee_id` varchar(128) not null,
  `institutional_email` varchar(256) default null,
  `password` varchar(64) not null,
  `role` enum('SUPERADMIN', 'ADMIN', 'TELLER', 'GUARD') not null,
  `status` enum('ACTIVE', 'INACTIVE', 'DISABLED') not null default 'ACTIVE',
  `created_at` datetime not null default current_timestamp(),
  `updated_at` datetime default null on update current_timestamp()
);