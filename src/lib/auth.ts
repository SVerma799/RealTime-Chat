import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { db } from "./db";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

/**
 * NextAuth options.
 *
 * @see https://next-auth.js.org/configuration/options
 * @type {NextAuthOptions}
 **/
export const authOptions: NextAuthOptions = {
  // we are using adpter here for storing session in redis.
  adapter: <Adapter>UpstashRedisAdapter(db),
  // we are using session stratey of JWT meaning Token based authenticatiopn
  session: {
    strategy: "jwt",
  },
  // Pretty simple all our providers are here.
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  // Custom pages for signin and signout.
  pages: {
    signIn: "/login",
  },
  // Callbacks for session and jwt.
  callbacks: {
    // This is called when a user signs in.
    // We are using this to store user in our database.
    async jwt({ user, token }) {
      // Benefit for using a type.d.ts file is that You dont need to import it.
      // They are available globally.
      const dbUser = (await db.get(`user ${token.id}`)) as User | null;

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };
    },

    // This is called when a session is checked on an API route or client side.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    // Redirect to dashboard after signin.
    redirect() {
      return "/dashboard";
    },
  },
};

/**
 * Get Google credentials from env variables.
 *
 * @return {*}
 */
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_ID;
  const clientSecret = process.env.GOOGLE_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_ID env variable");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_SECRET env variable");
  }

  return { clientId, clientSecret };
}
