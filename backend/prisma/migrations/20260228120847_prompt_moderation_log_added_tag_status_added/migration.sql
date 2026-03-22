-- AlterTable
ALTER TABLE `tag` ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `PromptModerationLog` (
    `id` VARCHAR(191) NOT NULL,
    `promptId` VARCHAR(191) NOT NULL,
    `action` ENUM('AUTO_APPROVED', 'AUTO_REJECTED', 'MANUAL_APPROVED', 'MANUAL_REJECTED', 'FLAGGED_FOR_REVIEW') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `confidence` DOUBLE NULL,
    `triggeredBy` VARCHAR(191) NULL,
    `reviewedById` VARCHAR(191) NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PromptModerationLog_promptId_idx`(`promptId`),
    INDEX `PromptModerationLog_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PromptModerationLog` ADD CONSTRAINT `PromptModerationLog_promptId_fkey` FOREIGN KEY (`promptId`) REFERENCES `Prompt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
