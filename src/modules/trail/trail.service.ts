import { prisma } from "@/infra/prisma-client"
import { ICreateTrail } from "./dto"
import { NotFoundError } from "@/domain"

export const GetMyTrails = async (userId: string) => {
  const trails = await prisma.trail.findMany({
    where: {
      user: {
        id: userId,
      },
      enabled: true
    }
  })
  return trails
}

export const GetTrailById = async (trailId: string, userId?: string) => {
  const trail = await prisma.trail.findUnique({
    where: {
      id: trailId,
      enabled: true,
      user: {
        id: userId
      }
    },
    include: {
      trail_post: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true
            }
          }
        }
      },
      trail_ranking: {
       select: {
        sequential: true,
        user: {
          select: {
            id: true,
            name: true,
            username:true
          }
       }
      }
    }
    }
  })
  return trail
}

export const CreateTrail = async (trail: ICreateTrail, userId: string) => {
  const createdTrail = await prisma.trail.create({
    data: {
      name: trail.name,
      description: trail.description,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
  return createdTrail
}

export const UpdateTrail = async (trailId: string, trail: ICreateTrail, userId: string) => {
  const trailExists = await prisma.trail.findUnique({
    where: {
      id: trailId,
      enabled: true,
      user: {
        id: userId
      }
    }
  })
  if (!trailExists) {
    throw new NotFoundError('Trilha não encontrada')
  }
  const updatedTrail = await prisma.trail.update({
    where: {
      id: trailId,
      user: {
        id: userId
      }
    },
    data: {
      name: trail.name,
      description: trail.description,
    }
  })
  return updatedTrail
}

export const DeleteTrail = async (trailId: string, userId: string) => {
  const trailExists = await prisma.trail.findUnique({
    where: {
      id: trailId,
      user: {
        id: userId
      }
    }
  })
  if (!trailExists) {
    throw new NotFoundError('Trilha não encontrada')
  }
  await prisma.trail.update({
    where: {
      id: trailId,
      user: {
        id: userId
      }
    },
    data: {
      enabled: false
    }
  })
}