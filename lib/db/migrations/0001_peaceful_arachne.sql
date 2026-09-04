ALTER TABLE "constructor_standings" ALTER COLUMN "points" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "constructor_standings" ALTER COLUMN "wins" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "constructor_standings" ALTER COLUMN "wins" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "driver_standings" ALTER COLUMN "points" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "driver_standings" ALTER COLUMN "wins" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "driver_standings" ALTER COLUMN "wins" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "driver_standings" ALTER COLUMN "podiums" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "driver_standings" ALTER COLUMN "podiums" DROP NOT NULL;