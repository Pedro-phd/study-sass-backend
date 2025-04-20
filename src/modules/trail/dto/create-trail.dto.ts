import { trailSchema } from "src/domain";
import z from "zod";

export const createTrailSchema = trailSchema.pick({
  name: true,
  description: true,
})

export type ICreateTrail = z.infer<typeof createTrailSchema>