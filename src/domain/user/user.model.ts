import { z } from "zod";

export const user = z.object({
  id: z.string(),
  loginProviderId: z.string(),
  loginProvider: z.enum(["SUPABASE"]),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  profilePicture: z.string().nullable(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})