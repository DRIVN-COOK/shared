import { z } from 'zod';
import { idSchema } from './common';
import { TruckStatus } from '../types';

export const truckCreateSchema = z.object({
  franchiseeId: idSchema,
  vin: z.string().min(6),
  plateNumber: z.string().min(3),
  model: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  active: z.boolean().default(true),
  currentStatus: z.nativeEnum(TruckStatus).default(TruckStatus.AVAILABLE),
});

export const truckUpdateSchema = truckCreateSchema.partial();

export type TruckCreate = z.infer<typeof truckCreateSchema>;
export type TruckUpdate = z.infer<typeof truckUpdateSchema>;
