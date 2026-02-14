CREATE TABLE "exercise_history" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_name" text NOT NULL,
	"weight" integer NOT NULL,
	"sets" integer NOT NULL,
	"reps_min" integer NOT NULL,
	"reps_max" integer,
	"user_id" text NOT NULL,
	"workout_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_history" ADD CONSTRAINT "exercise_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_history" ADD CONSTRAINT "exercise_history_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;