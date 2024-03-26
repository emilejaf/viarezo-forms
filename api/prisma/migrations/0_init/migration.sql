CREATE TABLE IF NOT EXISTS `forms`(
  `id` VARCHAR(255) NOT NULL,
  `login` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `subtitle` TEXT,
  `success_message` TEXT,
  `active` TINYINT(1) DEFAULT 0,
  `access` VARCHAR(255),
  `access_meta`VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `background_url` TEXT,
  `logo_url` TEXT,
  `anonym` TINYINT(1) DEFAULT 0,
  `unique_answer` TINYINT(1) DEFAULT 0,
  `private` TINYINT(1) DEFAULT 0,
  `secured` TINYINT(1) DEFAULT 0,
  `paps` TINYINT(1) DEFAULT 0,
  `paps_start` TIMESTAMP,
  `editable` TINYINT(1) DEFAULT 1,
  `paps_size` INT(11),
  PRIMARY KEY (`id`,`login`))
  CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `paps_choices`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paps_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `size` INT(11) DEFAULT 0,
  FOREIGN KEY (`paps_id`) REFERENCES `forms`(`id`) ,
  PRIMARY KEY (`id`))
CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `secured_forms_keys`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vote_id` VARCHAR(255) NOT NULL,
  `crypted_public` BLOB NOT NULL,
  `crypted_private` BLOB NOT NULL,
  `aes_checksum` BLOB NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (`vote_id`) REFERENCES `forms`(`id`)
)
CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `secured_forms_users`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `vote_id` VARCHAR(255) NOT NULL,
  `voted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`vote_id`) REFERENCES `forms`(`id`)
) CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `secured_forms_admin_creds`(
  `vote_id` VARCHAR(255) NOT NULL,
  `key` BINARY(32) NOT NULL,
  `iv` BINARY(16) NOT NULL,
  `aes_checksum` BLOB NOT NULL,
  `public_key` BLOB,
  `enc_priv_key` BLOB,
  PRIMARY KEY (`vote_id`),
  FOREIGN KEY (`vote_id`) REFERENCES `forms`(`id`)
)CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `can_answer`(
  `user_id` VARCHAR(255) NOT NULL,
  `form_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`,`form_id`),
  FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`)
)CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `has_answered`(
  `user_id` VARCHAR(255) NOT NULL,
  `form_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`,`form_id`),
  FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`)
)CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `moderators`(
  `moderator_login` VARCHAR(255) NOT NULL,
  `form_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`moderator_login`,`form_id`))
  CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `fields`(
  `id` VARCHAR(255) NOT NULL,
  `form_id` VARCHAR(255) NOT NULL,
  `type` ENUM('longq', 'shortq', 'mcq', 'drop', 'rank', 'slider', 'text') NOT NULL,
  `question` MEDIUMBLOB,
  `subtitle` TEXT,
  `index` int(11) NOT NULL DEFAULT -1,
  `needed` tinyint(1) NOT NULL DEFAULT 0,
  `meta` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`form_id`),
  FOREIGN KEY (`form_id`) REFERENCES forms(id))
  CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `choices`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` VARCHAR(255) NOT NULL,
  `form_id` VARCHAR(255) NOT NULL,
  `data` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`field_id`,`form_id`),
  FOREIGN KEY (`form_id`) REFERENCES forms(`id`),
  FOREIGN KEY (`field_id`,`form_id`) REFERENCES fields(`id`,`form_id`))
  CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `unique_link`(
    `key` VARCHAR(255) NOT NULL,
    `pass` VARCHAR(25) NOT NULL,
    `form_id` VARCHAR(255) NOT NULL,
    `name` TEXT,
    `active` TINYINT(1) NOT NULL,
    `expire_at` TIMESTAMP,
    PRIMARY KEY (`key`),
    FOREIGN KEY (`form_id`) REFERENCES forms(`id`)
) CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";

CREATE TABLE IF NOT EXISTS `answers`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form_id` VARCHAR(255) NOT NULL,
  `by` VARCHAR(255) DEFAULT 'Anonyme',
  `data` TEXT NOT NULL,
  `crypted_by` INT(11) UNIQUE,
  `signature` BLOB,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paps_choice_id` INT(11),
  `fullname` VARCHAR(255),
  `last_scan` TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`form_id`) REFERENCES forms(`id`),
  FOREIGN KEY (`paps_choice_id`) REFERENCES paps_choices(`id`),
  FOREIGN KEY (`crypted_by`) REFERENCES secured_forms_keys(`id`))
  CHARACTER SET UTF8mb4 COLLATE "utf8mb4_general_ci";