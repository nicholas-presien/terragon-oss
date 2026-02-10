DROP TABLE "feedback" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_reason";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_expires";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "shadow_banned";--> statement-breakpoint
ALTER TABLE "user_info_server_side" DROP COLUMN "stripe_credit_payment_method_id";