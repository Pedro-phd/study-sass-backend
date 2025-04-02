import { z } from "zod";

export const user = z.object({
  id: z.string(),
  loginProviderId: z.string(),
  loginProvider: z.enum(["SUPABASE"]),
  name: z.string(),
  username: z.string()
    .min(3, { message: "Username deve ter pelo menos 3 caracteres" })
    .max(20, { message: "Username não pode ter mais de 20 caracteres" })
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, { 
      message: "Username deve começar com uma letra e conter apenas letras, números, pontos, underscores e hífens" 
    })
    .refine(val => !val.includes(" "), { 
      message: "Username não pode conter espaços" 
    }),
  email: z.string().email({ message: "Email inválido" }),
  profilePicture: z.string().nullable(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
