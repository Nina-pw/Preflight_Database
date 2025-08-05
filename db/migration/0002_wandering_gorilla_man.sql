ALTER TABLE "todo" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "description" varchar(1000);--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "todo_text";