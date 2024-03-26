/*
  Warnings:

  - The primary key for the `forms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `forms` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`);
