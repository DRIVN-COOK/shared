// shared/src/contracts/product.ts
import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common'; // adapte le chemin si besoin

export const PRODUCT_TYPE = ['INGREDIENT','PREPARED_DISH','BEVERAGE','MISC'] as const;
export type ProductType = typeof PRODUCT_TYPE[number];

export const UNIT = ['KG','L','UNIT'] as const;
export type Unit = typeof UNIT[number];

export const productCreateSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(PRODUCT_TYPE),
  unit: z.enum(UNIT),
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
