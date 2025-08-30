import { z } from 'zod';
import { idSchema } from './common';

export const deploymentCreateSchema = z.object({
  truckId: idSchema,
  franchiseeId: idSchema,
  locationId: idSchema.optional(), // nullable côté API
  plannedStart: z.string().datetime(),
  plannedEnd: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export type DeploymentCreate = z.infer<typeof deploymentCreateSchema>;
