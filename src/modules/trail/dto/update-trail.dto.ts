import { trailSchema } from "src/domain";
import z from "zod";

export const updateTrailSchema = trailSchema.pick({
  name: true,
  description: true,
})

export type IUpdateTrail = z.infer<typeof updateTrailSchema>