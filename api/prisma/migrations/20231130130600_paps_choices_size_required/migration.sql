/*
  Warnings:

  - Made the column `size` on table `PapsChoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PapsChoice` MODIFY `size` INTEGER NOT NULL DEFAULT 0;
