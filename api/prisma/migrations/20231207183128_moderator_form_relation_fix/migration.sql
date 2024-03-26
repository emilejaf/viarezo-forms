-- Remove degenerated data (1 ROW affected)
DELETE FROM Moderator WHERE form_id = "";

-- CreateIndex
CREATE INDEX `Moderator_form_id_idx` ON `Moderator`(`form_id`);

-- AddForeignKey
ALTER TABLE `Moderator` ADD CONSTRAINT `Moderator_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
