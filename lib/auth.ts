import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { passkey } from "@better-auth/passkey";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: { deleteUser: { enabled: true } },
  plugins: [
    passkey({
      rpID: process.env.NODE_ENV === "production" 
        ? new URL(process.env.BETTER_AUTH_URL!).hostname 
        : "localhost",
      rpName: "Gym Tracker",
      origin: process.env.BETTER_AUTH_URL,
    }),
  ],
});
