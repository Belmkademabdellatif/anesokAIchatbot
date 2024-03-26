ALTER TABLE "conversations" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET NOT NULL;