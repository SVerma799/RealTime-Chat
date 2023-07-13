import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

/// Another way to do it.
// This helps us write core logic in a single file and use it in multiple places.
export default NextAuth(authOptions);
