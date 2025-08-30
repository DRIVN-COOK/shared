import { z } from 'zod';

export const supplierCreateSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  active: z.boolean().default(true),
});
export const supplierUpdateSchema = supplierCreateSchema.partial();
export type SupplierCreate = z.infer<typeof supplierCreateSchema>;
export type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;
