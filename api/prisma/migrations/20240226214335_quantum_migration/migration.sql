/*
  Warnings:

  - You are about to drop the column `created_at` on the `Choice` table. All the data in the column will be lost.

*/

-- Remove delete fields
DELETE FROM Field WHERE `index` < 0;

-- AlterTable
ALTER TABLE `Choice` DROP COLUMN `created_at`;

-- AlterTable
ALTER TABLE `Field` ALTER COLUMN `id` DROP DEFAULT;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_form_id_idx`;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_paps_choice_id_idx`;

-- DropForeignKey
ALTER TABLE `CanAnswer` DROP FOREIGN KEY `CanAnswer_form_id_idx`;

-- DropForeignKey
ALTER TABLE `Choice` DROP FOREIGN KEY `Choice_field_id_form_id_idx`;

-- DropForeignKey
ALTER TABLE `Choice` DROP FOREIGN KEY `Choice_form_id_idx`;

-- DropForeignKey
ALTER TABLE `Field` DROP FOREIGN KEY `Field_form_id_idx`;

-- DropForeignKey
ALTER TABLE `PapsChoice` DROP FOREIGN KEY `PapsChoice_paps_id_idx`;

-- DropForeignKey
ALTER TABLE `SecuredFormKey` DROP FOREIGN KEY `SecuredFormKey_vote_id_idx`;

-- DropForeignKey
ALTER TABLE `SecuredFormUser` DROP FOREIGN KEY `SecuredFormUser_voteId_idx`;

-- DropForeignKey
ALTER TABLE `UniqueLink` DROP FOREIGN KEY `UniqueLink_form_id_idx`;

-- RedefineIndex
CREATE INDEX `Answer_form_id_idx` ON `Answer`(`form_id`);

-- RedefineIndex
CREATE INDEX `Answer_paps_choice_id_idx` ON `Answer`(`paps_choice_id`);

-- RedefineIndex
CREATE INDEX `CanAnswer_form_id_idx` ON `CanAnswer`(`form_id`);

-- RedefineIndex
CREATE INDEX `Choice_field_id_form_id_idx` ON `Choice`(`field_id`, `form_id`);

-- RedefineIndex
CREATE INDEX `Choice_form_id_idx` ON `Choice`(`form_id`);

-- RedefineIndex
CREATE INDEX `Field_form_id_idx` ON `Field`(`form_id`);

-- RedefineIndex
CREATE INDEX `PapsChoice_paps_id_idx` ON `PapsChoice`(`paps_id`);

-- RedefineIndex
CREATE INDEX `SecuredFormKey_vote_id_idx` ON `SecuredFormKey`(`vote_id`);

-- RedefineIndex
CREATE INDEX `SecuredFormUser_voteId_idx` ON `SecuredFormUser`(`voteId`);

-- RedefineIndex
CREATE INDEX `UniqueLink_form_id_idx` ON `UniqueLink`(`form_id`);

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Choice` ADD CONSTRAINT `Choice_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Choice` ADD CONSTRAINT `Choice_field_id_form_id_fkey` FOREIGN KEY (`field_id`, `form_id`) REFERENCES `Field`(`id`, `form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_paps_choice_id_fkey` FOREIGN KEY (`paps_choice_id`) REFERENCES `PapsChoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanAnswer` ADD CONSTRAINT `CanAnswer_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PapsChoice` ADD CONSTRAINT `PapsChoice_paps_id_fkey` FOREIGN KEY (`paps_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecuredFormKey` ADD CONSTRAINT `SecuredFormKey_vote_id_fkey` FOREIGN KEY (`vote_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecuredFormUser` ADD CONSTRAINT `SecuredFormUser_voteId_fkey` FOREIGN KEY (`voteId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniqueLink` ADD CONSTRAINT `UniqueLink_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
