import { trailPostSchema } from "../../../domain";
import z from "zod";

export const CreateTrailPostSchema = trailPostSchema.pick({
  title: true,
  content: true,
})

export type ICreateTrailPost = z.infer<typeof CreateTrailPostSchema>