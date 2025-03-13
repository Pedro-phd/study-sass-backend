import { z } from "zod"
import { user } from "../../../domain/user/user.model.ts"

export const CreateUserSchema = user.omit({
  id: true,
  enabled: true,
  createdAt: true,
  updatedAt: true,
})

export type ICreateUser = z.infer<typeof CreateUserSchema>