import { betterAuth } from "better-auth";
import prisma from "./db";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  plugins: [admin()],
});
