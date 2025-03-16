import { prisma } from "@/infra/prisma-client"
import { ICreateUser } from "./dto"
import { Prisma } from "@prisma/client"

export const CreateUser = async (data: ICreateUser) => {
  const normalized: Prisma.userCreateInput = {
    ...data
  }
  await prisma.user.create({
    data: normalized
  })
}

export const GetUserByProviderId = async (providerId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      loginProviderId: providerId
    }
  })

  return user
}

export const CheckUsernameIsAvailable = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    }
  })

  if (user) {
    return false
  }

  return true
}