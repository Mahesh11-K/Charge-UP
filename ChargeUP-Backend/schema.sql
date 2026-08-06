-- =============================================================================
-- ChargeUP EV Charging Station Management Platform
-- MySQL Database Schema Definition for Production Authentication & User Profiles
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `chargeup_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `chargeup_db`;

-- -----------------------------------------------------------------------------
-- Table: users
-- Description: Stores authenticated platform users with role-based access control.
-- Supported Roles: 'driver' (EV Owner), 'station_owner' (CPO), 'admin' (System Operator)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('driver', 'station_owner', 'admin') NOT NULL DEFAULT 'driver',
  `authProvider` ENUM('local', 'google') NOT NULL DEFAULT 'local',
  `googleId` VARCHAR(255) NULL,
  `avatarUrl` VARCHAR(500) NULL,
  `lastLogin` DATETIME NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for optimal lookup performance
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: user_profiles
-- Description: Stores personal details, cartoon avatar preferences, emergency contacts,
-- address, and verification status for driver/profile dashboards.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL UNIQUE,
  `mobileNumber` VARCHAR(20) NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `zipCode` VARCHAR(20) NULL,
  `gender` ENUM('male', 'female', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
  `dateOfBirth` DATE NULL,
  `avatarUrl` VARCHAR(500) NULL,
  `avatarStyle` VARCHAR(50) DEFAULT 'cartoon_ev_1',
  `emergencyContact` VARCHAR(50) NULL,
  `evModel` VARCHAR(100) NULL,
  `bio` TEXT NULL,
  `isVerified` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_user_profiles_userId` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: reviews
-- Description: Stores driver ratings and textual reviews submitted by authenticated users.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100) NOT NULL DEFAULT 'EV Driver',
  `location` VARCHAR(100) NOT NULL DEFAULT 'Ireland',
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `isVerified` BOOLEAN DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX `idx_reviews_userId` (`userId`),
  INDEX `idx_reviews_rating` (`rating`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

