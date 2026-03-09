CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`message` text,
	`propertyId` int,
	`projectId` int,
	`inquiryType` enum('property_inquiry','project_inquiry','general_inquiry') NOT NULL,
	`status` enum('new','contacted','interested','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL,
	`status` enum('ongoing','completed','planning') NOT NULL,
	`imageUrl` varchar(500),
	`images` json,
	`startDate` timestamp,
	`completionDate` timestamp,
	`totalUnits` int,
	`completedUnits` int,
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(15,2) NOT NULL,
	`location` varchar(255) NOT NULL,
	`area` varchar(100) NOT NULL,
	`bedrooms` int,
	`bathrooms` int,
	`propertyType` enum('apartment','house','commercial','plot','office') NOT NULL,
	`status` enum('available','sold','rented') NOT NULL DEFAULT 'available',
	`imageUrl` varchar(500),
	`images` json,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
