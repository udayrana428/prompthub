-- CreateTable
CREATE TABLE `SeoOverride` (
    `id` VARCHAR(191) NOT NULL,
    `pageKey` VARCHAR(191) NOT NULL,
    `title` VARCHAR(70) NULL,
    `description` VARCHAR(160) NULL,
    `keywords` VARCHAR(500) NULL,
    `image` VARCHAR(500) NULL,
    `noIndex` BOOLEAN NOT NULL DEFAULT false,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `modifiedById` VARCHAR(191) NULL,

    UNIQUE INDEX `SeoOverride_pageKey_key`(`pageKey`),
    INDEX `SeoOverride_pageKey_idx`(`pageKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SeoOverride` ADD CONSTRAINT `SeoOverride_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
