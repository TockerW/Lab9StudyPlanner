import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Вкажіть назву завдання.')
    .max(100, 'Назва має містити не більше 100 символів.'),
  description: z.string().trim().max(500, 'Опис має містити не більше 500 символів.'),
  category: z
    .string()
    .trim()
    .min(1, 'Вкажіть категорію.')
    .max(40, 'Категорія має містити не більше 40 символів.'),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TaskFormData = z.infer<typeof taskSchema>;
