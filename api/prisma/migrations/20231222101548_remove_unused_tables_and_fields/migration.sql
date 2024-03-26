/*
  Warnings:

  - You are about to drop the column `private` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `pass` on the `UniqueLink` table. All the data in the column will be lost.
  - You are about to drop the `HasAnswered` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropTable
DROP TABLE `HasAnswered`;

-- AlterTable
ALTER TABLE `Form` DROP COLUMN `private`;

-- AlterTable
ALTER TABLE `UniqueLink` DROP COLUMN `pass`;

-- Rename Column
ALTER TABLE `SecuredFormKey` RENAME COLUMN `aes_checksum` TO `aesChecksum`;

-- Rename Column
ALTER TABLE  `SecuredFormUser` RENAME COLUMN `vote_id` TO `voteId`;

-- Rename Column
ALTER TABLE `SecuredFormUser` RENAME COLUMN `first_name` TO `firstName`;

-- Rename Column
ALTER TABLE `SecuredFormUser` RENAME COLUMN `last_name` TO `lastName`;

-- AlterTable
ALTER TABLE `SecuredFormUser` MODIFY `firstName` VARCHAR(255) NULL,
    MODIFY `lastName` VARCHAR(255) NULL, MODIFY `email` VARCHAR(255) NULL;

-- DropForeignKey
ALTER TABLE `SecuredFormUser` DROP FOREIGN KEY `SecuredFormUser_ibfk_1`;

-- AddForeignKey
ALTER TABLE `SecuredFormUser` ADD CONSTRAINT `SecuredFormUser_voteId_idx` FOREIGN KEY (`voteId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;