CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"brand" text NOT NULL,
	"price" integer NOT NULL,
	"original_price" integer,
	"stock_status" text DEFAULT 'instock',
	"compatible_bike" text,
	"colors" jsonb DEFAULT '[]'::jsonb,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
