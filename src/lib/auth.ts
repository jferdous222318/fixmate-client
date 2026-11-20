import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db, client } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL as string, "http://localhost:3000"],
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: false },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // server-side rule: only "customer" or "technician" can be chosen, never "admin"
        before: async (user) => ({
          data: { ...user, role: user.role === "technician" ? "technician" : "customer" },
        }),
      },
      update: {
        // nobody can change their own role through a profile update
        before: async (data) => {
          const { role, ...rest } = data as Record<string, unknown>;
          void role;
          return { data: rest };
        },
      },
    },
  },

  plugins: [nextCookies()],
});