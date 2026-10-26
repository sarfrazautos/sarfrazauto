ALTER TABLE "products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "main_image_index" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rating" text DEFAULT '5.0';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reviews_count" integer DEFAULT 0;