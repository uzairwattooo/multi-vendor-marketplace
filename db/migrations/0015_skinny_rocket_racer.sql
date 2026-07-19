ALTER TABLE "order" ALTER COLUMN "platform_fee" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "seller_amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shipping_address" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "shipping_address" ADD COLUMN "apartment" text;