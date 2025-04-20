import { prisma } from "src/infra/prisma-client"
import { ICreateUser } from "./dto"
import { Prisma } from "@prisma/client"
import { ConflictError, IInternalJWT, user } from "src/domain"

export const CreateUser = async (data: ICreateUser, jwt: IInternalJWT) => {
  const normalized: Prisma.userCreateInput = {
    ...data,
    loginProviderId: jwt.loginProviderId,
    email: jwt.email,
    profilePicture: jwt.user_metadata.avatar_url,
    plan: {
      connect: {
        id: 1
      }
    }
  }
  await prisma.user.create({
    data: normalized
  })
}

export const GetUserByProviderId = async (providerId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      loginProviderId: providerId
    },
    include: {
      plan: {
        select: {
          name: true,
          maxTrails: true,
        }
      }
    }
  })

  return user
}

export const CheckUsernameIsAvailable = async (username: string) => {
  
  const usernameSchema = user.shape.username
  const isValid = usernameSchema.safeParse(username)

  if(isValid.success === false) {
    throw new ConflictError('Invalid username')
  }
  
  const findUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      },
    }
  })

  if (findUser) {
    throw new ConflictError('Username is not available')
  }



  return 'Username is available'
}