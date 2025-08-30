import { z } from 'zod';

export const idSchema = z.string().uuid();
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(200).default(20),
});

export const moneyStringSchema = z.string().regex(/^\d+(\.\d{1,2})?$/, 'montant invalide'); // aligne-toi avec l’API
export const decimalQtySchema = z.string().regex(/^\d+(\.\d{1,3})?$/, 'quantité invalide');

export const dateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export type Pagination = z.infer<typeof paginationSchema>;