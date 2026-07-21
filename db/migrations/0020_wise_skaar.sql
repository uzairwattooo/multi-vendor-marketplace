ALTER TABLE "payment" ADD COLUMN "seller_payout_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "seller_paid_at" timestamp;