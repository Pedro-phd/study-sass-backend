import { prisma } from "@/infra/prisma-client"
import { ICreateUser } from "./dto"
import { Prisma } from "@prisma/client"
import type { IInternalJWT } from "@/domain"

export const CreateUser = async (data: ICreateUser, jwt: IInternalJWT) => {
  const normalized: Prisma.userCreateInput = {
    ...data,
    loginProviderId: jwt.loginProviderId,
    email: jwt.email,
    profilePicture: jwt.user_metadata.avatar_url
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
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      },
    }
  })

  if (user) {
    return false
  }

  return true
}