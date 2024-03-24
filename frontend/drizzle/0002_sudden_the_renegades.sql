ALTER TABLE "messages" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "is_ai" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";