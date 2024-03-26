
-- RenameTable 
ALTER TABLE `answers` RENAME TO `Answer`;

-- RenameTable 
ALTER TABLE `can_answer` RENAME TO `CanAnswer`;

-- RenameTable 
ALTER TABLE `choices` RENAME TO `Choice`;

-- RenameTable 
ALTER TABLE `fields` RENAME TO `Field`;

-- RenameTable 
ALTER TABLE `forms` RENAME TO `Form`;

-- RenameTable 
ALTER TABLE `has_answered` RENAME TO `HasAnswered`;

-- RenameTable 
ALTER TABLE `moderators` RENAME TO `Moderator`;

-- RenameTable
ALTER TABLE `paps_choices` RENAME TO `PapsChoice`;

-- RenameTable
ALTER TABLE `secured_forms_admin_creds` RENAME TO `SecuredFormAdminCredentials`;

-- RenameTable
ALTER TABLE `secured_forms_keys` RENAME TO `SecuredFormKey`;

-- RenameTable
ALTER TABLE `secured_forms_users` RENAME TO `SecuredFormUser`;

-- RenameTable
ALTER TABLE `unique_link` RENAME TO `UniqueLink`;


-- RenameColumn
ALTER TABLE `Field` RENAME COLUMN `needed` TO `required`;


-- AddDefault
ALTER TABLE `Field` ALTER COLUMN `id` SET DEFAULT (uuid());