import { z } from "zod"
import { user } from "../../../domain/user/user.model"

export const CreateUserSchema = user.omit({
  id: true,
  enabled: true,
  createdAt: true,
  updatedAt: true,
  loginProviderId: true,
  email: true,
  profilePicture: true
})

export type ICreateUser = z.infer<typeof CreateUserSchema>