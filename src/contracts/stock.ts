import { z } from 'zod';
import { idSchema, decimalQtySchema } from './common';
import { StockMoveType } from '../types';

export const movementCreateSchema = z.object({
  warehouseId: idSchema,
  productId: idSchema,
  qty: decimalQtySchema,             // positif (entrée) ou négatif (sortie)
  type: z.nativeEnum(StockMoveType).default(StockMoveType.ADJUSTMENT),
  refType: z.string().optional(),
  refId: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
export type MovementCreate = z.infer<typeof movementCreateSchema>;
