ALTER TABLE "store" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "is_stripe_connected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "stripe_charges_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "stripe_payouts_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "stripe_details_submitted" boolean DEFAULT false NOT NULL;