import { prisma } from "@/infra/prisma-client"

export const GetMyTrails = async (userId: string) => {
  const trails = await prisma.trail.findMany({
    where: {
      user: {
        id: userId
      }
    }
  })
  return trails
}

export const GetTrailById = async (trailId: string) => {
  const trail = await prisma.trail.findUnique({
    where: {
      id: trailId
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
      }
    }
  })
  return trail
}