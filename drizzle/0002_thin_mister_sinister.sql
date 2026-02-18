CREATE TABLE "shared_workout" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_id" text NOT NULL,
	"user_id" text NOT NULL,
	"share_notes" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shared_workout" ADD CONSTRAINT "shared_workout_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_workout" ADD CONSTRAINT "shared_workout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shared_workout_workoutId_idx" ON "shared_workout" USING btree ("workout_id");