CREATE TABLE windows(
  `uuid` char(36) not null primary key,
  `name` varchar(255) not null,
  `department` varchar(255) default null,
  `teller_id` char(36) default null,
  `type` enum('cashier', 'registrar', 'accounting') not null,
  `created_at` datetime not null default current_timestamp(),
  `updated_at` datetime default null on update current_timestamp()
);