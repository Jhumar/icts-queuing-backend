CREATE TABLE `medias` (
  `uuid` char(36) not null primary key,
  `name` varchar(255) not null,
  `path` text not null,
  `slot` char(36) default null,
  `created_at` datetime not null default current_timestamp(),
  `updated_at` datetime default null on update current_timestamp()
);