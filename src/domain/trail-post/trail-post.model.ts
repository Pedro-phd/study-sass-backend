import { z } from 'zod';

export const trailPostSchema = z.object({
  id: z.string().uuid(),
  trailId: z.string().uuid().describe('ID da trilha relacionada'),
  title: z.string().min(1).describe('Título do post'),
  content: z.string().optional().describe('Conteúdo do post'),
  picture: z.string().optional().describe('URL da imagem do post'),
  ownerId: z.string().uuid().describe('ID do proprietário do post'),
});


export type ITrailPost = z.infer<typeof trailPostSchema>;
