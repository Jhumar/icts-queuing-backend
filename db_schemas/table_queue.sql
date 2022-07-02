CREATE TABLE `queues` (
  `uuid` char(36) not null primary key,
  `window_id` char(36) not null,
  `window_name` varchar(255) not null,
  `number` int(11) not null,
  `label` char(36) not null,
  `status` enum('pending', 'completed', 'cancelled') default 'pending',
  `created_at` datetime not null default current_timestamp(),
  `updated_at` datetime default null on update current_timestamp()
);