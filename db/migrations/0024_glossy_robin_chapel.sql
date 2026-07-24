CREATE TABLE "platform_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"marketplace_name" text DEFAULT 'Marketplace' NOT NULL,
	"support_email" text DEFAULT '' NOT NULL,
	"support_phone" text DEFAULT '' NOT NULL,
	"currency" text DEFAULT 'PKR' NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"minimum_order_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"stripe_enabled" boolean DEFAULT true NOT NULL,
	"cod_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
