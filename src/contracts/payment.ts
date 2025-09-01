import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common';
import { PaymentProvider, PaymentStatus } from '../types';

export const paymentCreateSchema = z.object({
  customerOrderId: idSchema,
  provider: z.nativeEnum(PaymentProvider),
  amount: moneyStringSchema,
});

export const paymentUpdateSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
  paidAt: z.string().datetime().optional(),
  transactionRef: z.string().optional(),
});
