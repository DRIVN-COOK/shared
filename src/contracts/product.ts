// shared/src/contracts/product.ts
import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common'; // adapte le chemin si besoin
import { ProductType, Unit } from '../types';

export const productCreateSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(ProductType),
  unit: z.nativeEnum(Unit),
  isCoreStock: z.boolean().default(true),
  active: z.boolean().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

/** Prix produit (historique) */
export const productPriceCreateSchema = z.object({
  productId: idSchema,
  validFrom: z.string().datetime(),      // "2025-08-30T12:30:00.000Z"
  validTo: z.string().datetime().optional(),
  priceHT: moneyStringSchema,            // "12.50"
  tvaPct: z.string(),                    // "5.50"
});
export type ProductPriceCreate = z.infer<typeof productPriceCreateSchema>;
