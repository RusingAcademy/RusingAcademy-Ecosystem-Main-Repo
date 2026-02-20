CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`accountType` varchar(64) NOT NULL,
	`detailType` varchar(128),
	`description` text,
	`balance` decimal(15,2) DEFAULT '0.00',
	`bankBalance` decimal(15,2),
	`isActive` boolean NOT NULL DEFAULT true,
	`isSubAccount` boolean DEFAULT false,
	`parentAccountId` int,
	`accountNumber` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(64) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` int,
	`details` json,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bank_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`description` varchar(500),
	`amount` decimal(15,2) NOT NULL,
	`fitId` varchar(128),
	`status` enum('For Review','Categorized','Excluded','Matched') NOT NULL DEFAULT 'For Review',
	`matchedTransactionType` varchar(64),
	`matchedTransactionId` int,
	`categoryAccountId` int,
	`memo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bank_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bill_line_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`billId` int NOT NULL,
	`accountId` int,
	`description` text,
	`amount` decimal(15,2) DEFAULT '0.00',
	`taxCode` varchar(32),
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`isBillable` boolean DEFAULT false,
	`billableCustomerId` int,
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `bill_line_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`billNumber` varchar(64),
	`supplierId` int NOT NULL,
	`billDate` timestamp NOT NULL,
	`dueDate` timestamp,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`amountPaid` decimal(15,2) DEFAULT '0.00',
	`amountDue` decimal(15,2) DEFAULT '0.00',
	`status` enum('Draft','Open','Partial','Paid','Overdue','Voided') NOT NULL DEFAULT 'Draft',
	`memo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`legalName` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`address` text,
	`city` varchar(128),
	`province` varchar(128),
	`postalCode` varchar(20),
	`country` varchar(64) DEFAULT 'Canada',
	`currency` varchar(3) DEFAULT 'CAD',
	`fiscalYearStart` varchar(5) DEFAULT '01-01',
	`taxId` varchar(64),
	`logo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`company` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`mobile` varchar(64),
	`website` varchar(255),
	`billingAddress` text,
	`shippingAddress` text,
	`notes` text,
	`balance` decimal(15,2) DEFAULT '0.00',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `estimate_line_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`estimateId` int NOT NULL,
	`productId` int,
	`description` text,
	`quantity` decimal(10,2) DEFAULT '1.00',
	`rate` decimal(15,2) DEFAULT '0.00',
	`amount` decimal(15,2) DEFAULT '0.00',
	`taxCode` varchar(32),
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `estimate_line_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `estimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`estimateNumber` varchar(64) NOT NULL,
	`customerId` int NOT NULL,
	`estimateDate` timestamp NOT NULL,
	`expiryDate` timestamp,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`status` enum('Draft','Sent','Accepted','Rejected','Converted','Closed') NOT NULL DEFAULT 'Draft',
	`notes` text,
	`convertedInvoiceId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estimates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expense_line_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expenseId` int NOT NULL,
	`accountId` int,
	`description` text,
	`amount` decimal(15,2) DEFAULT '0.00',
	`taxCode` varchar(32),
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`isBillable` boolean DEFAULT false,
	`billableCustomerId` int,
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `expense_line_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expenseType` enum('Expense','Cheque Expense','Bill Payment') NOT NULL DEFAULT 'Expense',
	`payeeType` enum('supplier','customer','other') DEFAULT 'other',
	`payeeId` int,
	`payeeName` varchar(255),
	`accountId` int,
	`expenseDate` timestamp NOT NULL,
	`paymentMethod` varchar(64),
	`referenceNumber` varchar(64),
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`memo` text,
	`receiptUrl` text,
	`isBillable` boolean DEFAULT false,
	`billableCustomerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoice_line_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` int NOT NULL,
	`productId` int,
	`description` text,
	`quantity` decimal(10,2) DEFAULT '1.00',
	`rate` decimal(15,2) DEFAULT '0.00',
	`amount` decimal(15,2) DEFAULT '0.00',
	`taxCode` varchar(32),
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `invoice_line_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceNumber` varchar(64) NOT NULL,
	`customerId` int NOT NULL,
	`invoiceDate` timestamp NOT NULL,
	`dueDate` timestamp,
	`subtotal` decimal(15,2) DEFAULT '0.00',
	`taxAmount` decimal(15,2) DEFAULT '0.00',
	`total` decimal(15,2) DEFAULT '0.00',
	`amountPaid` decimal(15,2) DEFAULT '0.00',
	`amountDue` decimal(15,2) DEFAULT '0.00',
	`status` enum('Draft','Sent','Viewed','Partial','Paid','Overdue','Deposited','Voided') NOT NULL DEFAULT 'Draft',
	`notes` text,
	`terms` text,
	`isSent` boolean DEFAULT false,
	`pdfUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entryNumber` varchar(64),
	`entryDate` timestamp NOT NULL,
	`memo` text,
	`isAdjusting` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_entry_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`journalEntryId` int NOT NULL,
	`accountId` int NOT NULL,
	`debit` decimal(15,2) DEFAULT '0.00',
	`credit` decimal(15,2) DEFAULT '0.00',
	`description` text,
	`customerId` int,
	`supplierId` int,
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `journal_entry_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentId` int NOT NULL,
	`invoiceId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	CONSTRAINT `payment_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`paymentDate` timestamp NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`paymentMethod` varchar(64),
	`referenceNumber` varchar(64),
	`depositToAccountId` int,
	`memo` text,
	`isDeposited` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('Service','Inventory','Non-Inventory') NOT NULL DEFAULT 'Service',
	`category` varchar(128),
	`price` decimal(15,2) DEFAULT '0.00',
	`cost` decimal(15,2),
	`sku` varchar(64),
	`isTaxable` boolean DEFAULT true,
	`incomeAccountId` int,
	`expenseAccountId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reconciliations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`statementDate` timestamp NOT NULL,
	`statementBalance` decimal(15,2) NOT NULL,
	`clearedBalance` decimal(15,2),
	`difference` decimal(15,2),
	`status` enum('In Progress','Completed') NOT NULL DEFAULT 'In Progress',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reconciliations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurring_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateName` varchar(255) NOT NULL,
	`transactionType` enum('Invoice','Expense','Bill','Journal Entry') NOT NULL,
	`frequency` enum('Daily','Weekly','Monthly','Yearly') NOT NULL,
	`intervalCount` int DEFAULT 1,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`nextDate` timestamp,
	`templateData` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurring_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`company` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`mobile` varchar(64),
	`website` varchar(255),
	`address` text,
	`notes` text,
	`balance` decimal(15,2) DEFAULT '0.00',
	`taxId` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tax_filings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agency` varchar(255) NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`collectedOnSales` decimal(15,2) DEFAULT '0.00',
	`paidOnPurchases` decimal(15,2) DEFAULT '0.00',
	`adjustment` decimal(15,2) DEFAULT '0.00',
	`netTax` decimal(15,2) DEFAULT '0.00',
	`status` enum('Upcoming','Due','Filed','Paid') NOT NULL DEFAULT 'Upcoming',
	`filedDate` timestamp,
	`paidDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tax_filings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tax_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`code` varchar(32) NOT NULL,
	`rate` decimal(6,4) NOT NULL,
	`agency` varchar(255),
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tax_rates_id` PRIMARY KEY(`id`)
);
