import { prisma } from "@/infra/prisma-client"
import { ICreateTrailPost } from "./dto/create-trail-post.dto"
import { IInternalJWT, NotFoundError } from "@/domain"
import { eachDayOfInterval, format, getOverlappingDaysInIntervals, interval, isEqual } from "date-fns"

export const CreateTrailPost = async (trailId: string, body: ICreateTrailPost, user: IInternalJWT) => {
  const trail = await prisma.trail.findUnique({
    where: {
      id: trailId,
      enabled: true,
      ownerId: user.id
    },
    include: {
      trail_post: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      },
      trail_ranking: {
        where: {
          ownerId: user.id
        }
      }
    }
  })

  if(!trail) {
    throw new NotFoundError('Trilha não encontrada')
  }

  await prisma.trail_post.create({
    data: {
      title: body.title,
      content: body.content,
      trailId: trail.id,
      ownerId: user.id,
    }
  })

  const lastPost = trail?.trail_post[0]
  const today = new Date()

  
  
  if(lastPost === undefined){
    await prisma.trail_ranking.create({
      data: {
        sequential: 1,
        trailId: trail.id,
        ownerId: user.id
      }
    })

    return
  } 
  const diference = eachDayOfInterval({ start: today, end: lastPost?.createdAt })
  const lastPostIsToday = format(today, 'dd/MM/yyyy') === format(lastPost?.createdAt, 'dd/MM/yyyy')


  // se a diferença entre a data de criação do post e a data de hoje for maior que 0, 
  // então significa que tem um dia de diferença, então zerar e começar dnv
  if(diference.length > 1) {
    console.log("Caiu aqui ?")
    await prisma.trail_ranking.upsert({
      where: {
        id: trail.trail_ranking[0].id,
        trailId: trail.id,
        ownerId: user.id
      },
      update: {
        sequential: 1
      },
      create: {
        sequential: 1,
        trailId: trail.id,
        ownerId: user.id
      }
    })
  }

  // se a diferença entre a data de criação do post e a data de hoje for igual a 0, 
  // então significa que não tem um dia de diferença, então somar 1 ao sequential
  else if(diference.length === 1 && !lastPostIsToday) {
    console.log('nao pode cair aqui', lastPostIsToday)

    await prisma.trail_ranking.upsert({
      where: {
        id: trail.trail_ranking[0].id,
        trailId: trail.id,
        ownerId: user.id
      },
      update: {
        sequential: trail.trail_ranking[0].sequential + 1
      },
      create: {
        sequential: 1,
        trailId: trail.id,
        ownerId: user.id
      }
    })
  }

  
}
