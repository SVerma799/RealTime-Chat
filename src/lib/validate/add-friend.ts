import { z } from "zod";

// Zod is basically a validator built to validate the model string.
export const addFriendValidator = z.object({
  email: z.string().email(),
});
