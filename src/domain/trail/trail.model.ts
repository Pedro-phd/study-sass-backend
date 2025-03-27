import { z } from 'zod';

export const trailSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).describe('Nome da trilha'),
  description: z.string().optional().describe('Descrição da trilha'),
  ownerId: z.string().uuid(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Tipo para uma trilha
export type Trail = z.infer<typeof trailSchema>;