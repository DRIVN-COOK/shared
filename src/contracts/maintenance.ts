import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common';
import { MaintenanceType, MaintenanceStatus } from '../types';

export const maintenanceCreateSchema = z.object({
  truckId: idSchema,
  type: z.nativeEnum(MaintenanceType).default(MaintenanceType.SERVICE),
  status: z.nativeEnum(MaintenanceStatus).default(MaintenanceStatus.PLANNED),
  scheduledAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  cost: moneyStringSchema.optional(),
  notes: z.string().max(2000).optional(),
});

export const maintenanceUpdateSchema = maintenanceCreateSchema.partial();

export type MaintenanceCreate = z.infer<typeof maintenanceCreateSchema>;
export type MaintenanceUpdate = z.infer<typeof maintenanceUpdateSchema>;
