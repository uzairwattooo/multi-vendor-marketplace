CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'cod');--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_method" "payment_method" DEFAULT 'stripe' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "stripe_payment_intent_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "currency" text DEFAULT 'usd' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "store_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE restrict ON UPDATE no action;