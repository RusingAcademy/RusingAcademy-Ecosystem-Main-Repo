-- Phase 14: Public API v1
-- Flag: PUBLIC_API_ENABLED

CREATE TABLE IF NOT EXISTS `api_keys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `keyHash` VARCHAR(64) NOT NULL,
  `keyPrefix` VARCHAR(10) NOT NULL,
  `scopes` TEXT,
  `rateLimit` INT DEFAULT 100,
  `isActive` BOOLEAN DEFAULT TRUE,
  `lastUsedAt` TIMESTAMP NULL,
  `expiresAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revokedAt` TIMESTAMP NULL,
  UNIQUE KEY `idx_key_hash` (`keyHash`),
  KEY `idx_key_prefix` (`keyPrefix`)
);

CREATE TABLE IF NOT EXISTS `api_request_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `apiKeyId` INT NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `statusCode` INT NOT NULL,
  `responseTimeMs` INT,
  `ipAddress` VARCHAR(45),
  `userAgent` VARCHAR(500),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`apiKeyId`) REFERENCES `api_keys`(`id`),
  KEY `idx_api_key_date` (`apiKeyId`, `createdAt`)
);
