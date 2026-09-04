CREATE TYPE "public"."data_confidence" AS ENUM('verified', 'placeholder', 'uncertain');--> statement-breakpoint
CREATE TYPE "public"."result_status" AS ENUM('finished', 'dnf', 'dsq', 'dns');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"body" text NOT NULL,
	"cover_image_url" text,
	"tags" text[],
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"team_id" uuid NOT NULL,
	"season_id" uuid NOT NULL,
	"chassis_name" text,
	"engine_manufacturer" text,
	"engine_config" text,
	"capacity_liters" numeric(3, 1),
	"power_hp" integer,
	"weight_kg" integer,
	"image_url" text,
	"technical_breakdown" jsonb,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(chassis_name, '')), 'B') || setweight(to_tsvector('simple', coalesce(engine_manufacturer, '')), 'C')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cars_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "circuits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"location" text,
	"length_km" numeric(6, 3),
	"turns" integer,
	"laps_standard" integer,
	"lap_record_time" text,
	"lap_record_holder_driver_id" uuid,
	"lap_record_year" integer,
	"first_gp_year" integer,
	"layout_image_url" text,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(country, '')), 'B') || setweight(to_tsvector('simple', coalesce(location, '')), 'C')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "circuits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "constructor_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"points" numeric(7, 2) DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	CONSTRAINT "constructor_standings_season_team_unique" UNIQUE("season_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "driver_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"points" numeric(7, 2) DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"podiums" integer DEFAULT 0 NOT NULL,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	CONSTRAINT "driver_standings_season_driver_unique" UNIQUE("season_id","driver_id")
);
--> statement-breakpoint
CREATE TABLE "driver_team_seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"season_id" uuid NOT NULL,
	"car_id" uuid,
	CONSTRAINT "driver_team_seasons_unique" UNIQUE("driver_id","team_id","season_id")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"full_name" text NOT NULL,
	"nationality" text NOT NULL,
	"date_of_birth" date,
	"date_of_death" date,
	"career_start_year" integer,
	"career_end_year" integer,
	"photo_url" text,
	"bio" text,
	"championships" integer,
	"wins" integer,
	"poles" integer,
	"podiums" integer,
	"race_starts" integer,
	"career_points" numeric(8, 2),
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('simple', coalesce(full_name, '')), 'A') || setweight(to_tsvector('simple', coalesce(nationality, '')), 'C')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drivers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"circuit_id" uuid NOT NULL,
	"round_number" integer NOT NULL,
	"name" text NOT NULL,
	"date" date,
	"laps" integer,
	"distance_km" numeric(7, 3),
	"pole_position_driver_id" uuid,
	"fastest_lap_driver_id" uuid,
	"winner_driver_id" uuid,
	"winner_team_id" uuid,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "races_season_round_unique" UNIQUE("season_id","round_number")
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"race_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"car_id" uuid,
	"grid_position" integer,
	"finish_position" integer,
	"status" "result_status" DEFAULT 'finished' NOT NULL,
	"points" numeric(6, 2) DEFAULT 0 NOT NULL,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	CONSTRAINT "results_race_driver_unique" UNIQUE("race_id","driver_id")
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"world_champion_driver_id" uuid,
	"constructors_champion_team_id" uuid,
	"summary" text,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', coalesce(summary, ''))) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seasons_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"nationality" text NOT NULL,
	"founded_year" integer,
	"dissolved_year" integer,
	"logo_url" text,
	"base_location" text,
	"bio" text,
	"championships" integer,
	"wins" integer,
	"poles" integer,
	"data_confidence" "data_confidence" DEFAULT 'placeholder' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(nationality, '')), 'C')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "circuits" ADD CONSTRAINT "circuits_lap_record_holder_driver_id_drivers_id_fk" FOREIGN KEY ("lap_record_holder_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "constructor_standings" ADD CONSTRAINT "constructor_standings_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "constructor_standings" ADD CONSTRAINT "constructor_standings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_standings" ADD CONSTRAINT "driver_standings_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_standings" ADD CONSTRAINT "driver_standings_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_standings" ADD CONSTRAINT "driver_standings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_team_seasons" ADD CONSTRAINT "driver_team_seasons_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_team_seasons" ADD CONSTRAINT "driver_team_seasons_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_team_seasons" ADD CONSTRAINT "driver_team_seasons_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_team_seasons" ADD CONSTRAINT "driver_team_seasons_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_circuit_id_circuits_id_fk" FOREIGN KEY ("circuit_id") REFERENCES "public"."circuits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_pole_position_driver_id_drivers_id_fk" FOREIGN KEY ("pole_position_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_fastest_lap_driver_id_drivers_id_fk" FOREIGN KEY ("fastest_lap_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_winner_driver_id_drivers_id_fk" FOREIGN KEY ("winner_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_winner_team_id_teams_id_fk" FOREIGN KEY ("winner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_world_champion_driver_id_drivers_id_fk" FOREIGN KEY ("world_champion_driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_constructors_champion_team_id_teams_id_fk" FOREIGN KEY ("constructors_champion_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cars_search_idx" ON "cars" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "circuits_search_idx" ON "circuits" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "driver_team_seasons_driver_season_idx" ON "driver_team_seasons" USING btree ("driver_id","season_id");--> statement-breakpoint
CREATE INDEX "drivers_search_idx" ON "drivers" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "seasons_search_idx" ON "seasons" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "teams_search_idx" ON "teams" USING gin ("search_vector");