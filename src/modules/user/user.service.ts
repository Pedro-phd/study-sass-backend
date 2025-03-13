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