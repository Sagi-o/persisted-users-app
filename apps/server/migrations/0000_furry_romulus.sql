CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`gender` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`pictureLarge` text NOT NULL,
	`pictureThumbnail` text NOT NULL,
	`country` text NOT NULL,
	`state` text NOT NULL,
	`city` text NOT NULL,
	`streetNumber` integer NOT NULL,
	`streetName` text NOT NULL,
	`dobDate` text NOT NULL,
	`age` integer NOT NULL,
	`createdAt` integer NOT NULL
);
