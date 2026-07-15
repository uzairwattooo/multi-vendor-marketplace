CREATE TYPE "public"."store_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TABLE "store" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"logo" text,
	"banner" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"country" text DEFAULT 'Pakistan' NOT NULL,
	"status" "store_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "store_owner_id_unique" ON "store" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "store_slug_unique" ON "store" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "store_status_idx" ON "store" USING btree ("status");