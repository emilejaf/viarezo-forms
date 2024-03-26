-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_ibfk_3`;

-- DropForeignKey
ALTER TABLE `CanAnswer` DROP FOREIGN KEY `CanAnswer_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Choice` DROP FOREIGN KEY `Choice_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Choice` DROP FOREIGN KEY `Choice_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Field` DROP FOREIGN KEY `Field_ibfk_1`;

-- DropForeignKey
ALTER TABLE `PapsChoice` DROP FOREIGN KEY `PapsChoice_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SecuredFormAdminCredentials` DROP FOREIGN KEY `SecuredFormAdminCredentials_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SecuredFormKey` DROP FOREIGN KEY `SecuredFormKey_ibfk_1`;

-- DropForeignKey
ALTER TABLE `UniqueLink` DROP FOREIGN KEY `UniqueLink_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_form_id_idx` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Choice` ADD CONSTRAINT `Choice_form_id_idx` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Choice` ADD CONSTRAINT `Choice_field_id_form_id_idx` FOREIGN KEY (`field_id`, `form_id`) REFERENCES `Field`(`id`, `form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_form_id_idx` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_paps_choice_id_idx` FOREIGN KEY (`paps_choice_id`) REFERENCES `PapsChoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_crypted_by_fkey` FOREIGN KEY (`crypted_by`) REFERENCES `SecuredFormKey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanAnswer` ADD CONSTRAINT `CanAnswer_form_id_idx` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PapsChoice` ADD CONSTRAINT `PapsChoice_paps_id_idx` FOREIGN KEY (`paps_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecuredFormAdminCredentials` ADD CONSTRAINT `SecuredFormAdminCredentials_vote_id_fkey` FOREIGN KEY (`vote_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecuredFormKey` ADD CONSTRAINT `SecuredFormKey_vote_id_idx` FOREIGN KEY (`vote_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniqueLink` ADD CONSTRAINT `UniqueLink_form_id_idx` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- RenameIndex
ALTER TABLE `Answer` RENAME INDEX `crypted_by` TO `Answer_crypted_by_key`;