import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common';
import { MAINTENANCE_STATUS, MAINTENANCE_TYPE } from './enums';

export type MaintenanceType = typeof MAINTENANCE_TYPE[number];
export type MaintenanceStatus = typeof MAINTENANCE_STATUS[number];

export const maintenanceCreateSchema = z.object({
  truckId: idSchema,
  type: z.enum(MAINTENANCE_TYPE).default('SERVICE'),
  status: z.enum(MAINTENANCE_STATUS).default('PLANNED'),
  scheduledAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  cost: moneyStringSchema.optional(),
  notes: z.string().max(2000).optional(),
});

export const maintenanceUpdateSchema = maintenanceCreateSchema.partial();

export type MaintenanceCreate = z.infer<typeof maintenanceCreateSchema>;
export type MaintenanceUpdate = z.infer<typeof maintenanceUpdateSchema>;
