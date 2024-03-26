/*
  Warnings:

  - You are about to drop the column `aes_checksum` on the `SecuredFormAdminCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `SecuredFormAdminCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `SecuredFormAdminCredentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SecuredFormAdminCredentials` DROP COLUMN `aes_checksum`,
    DROP COLUMN `iv`,
    DROP COLUMN `key`;
