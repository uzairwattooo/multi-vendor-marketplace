ALTER TABLE "order_item" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "platform_fee" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "seller_amount" SET NOT NULL;