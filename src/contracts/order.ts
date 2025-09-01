import { z } from 'zod';
import { idSchema, moneyStringSchema, decimalQtySchema } from './common';
import { Channel, OrderStatus } from '../types';


export const orderLineSchema = z.object({
  menuItemId: idSchema,
  qty: z.number().int().positive(),
  unitPriceHT: moneyStringSchema,
  tvaPct: z.string(), // "5.50"
  lineTotalHT: moneyStringSchema.optional(), // calculable client si besoin
});

export const orderCreateSchema = z.object({
  customerId: idSchema,
  franchiseeId: idSchema,
  truckId: idSchema.optional(),
  warehouseId: idSchema.optional(),
  channel: z.nativeEnum(Channel).default(Channel.IN_PERSON),
  scheduledPickupAt: z.string().datetime().optional(),
  lines: z.array(orderLineSchema).min(1),
});

export const orderStatusChangeSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const orderQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  channel: z.nativeEnum(Channel).optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),
  truckId: idSchema.optional(),
  franchiseeId: idSchema.optional(),
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(200).optional(),
});
