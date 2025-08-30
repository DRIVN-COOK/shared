import { z } from 'zod';
import { idSchema, decimalQtySchema } from './common';
import { STOCK_MOVE_TYPE } from './enums';

export type StockMoveType = typeof STOCK_MOVE_TYPE[number];

export const movementCreateSchema = z.object({
  warehouseId: idSchema,
  productId: idSchema,
  qty: decimalQtySchema,             // positif (entrée) ou négatif (sortie)
  type: z.enum(STOCK_MOVE_TYPE).default('ADJUSTMENT'),
  refType: z.string().optional(),
  refId: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
export type MovementCreate = z.infer<typeof movementCreateSchema>;
