import { z } from 'zod';

export const warehouseCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  hasKitchen: z.boolean().default(true),
  active: z.boolean().default(true),
});
export const warehouseUpdateSchema = warehouseCreateSchema.partial();
export type WarehouseCreate = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdate = z.infer<typeof warehouseUpdateSchema>;
