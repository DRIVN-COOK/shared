import { z } from 'zod';
import { idSchema } from './common';
import { TRUCK_STATUS } from './enums';

export const truckCreateSchema = z.object({
  franchiseeId: idSchema,
  vin: z.string().min(6),
  plateNumber: z.string().min(3),
  model: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  active: z.boolean().default(true),
  currentStatus: z.enum(TRUCK_STATUS).default('AVAILABLE'),
});

export const truckUpdateSchema = truckCreateSchema.partial();

export type TruckCreate = z.infer<typeof truckCreateSchema>;
export type TruckUpdate = z.infer<typeof truckUpdateSchema>;
