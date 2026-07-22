ALTER TABLE "store" ADD COLUMN "business_type" text DEFAULT 'individual' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "business_name" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "registration_number" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "ntn" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "strn" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "primary_color" text DEFAULT '#2563eb' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "secondary_color" text DEFAULT '#111827' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "landmark" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "maps_url" text;