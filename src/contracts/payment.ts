import { z } from 'zod';
import { idSchema, moneyStringSchema } from './common';
import { PAYMENT_PROVIDER, PAYMENT_STATUS } from './enums';

export const paymentCreateSchema = z.object({
  customerOrderId: idSchema,
  provider: z.enum(PAYMENT_PROVIDER),
  amount: moneyStringSchema,
});

export const paymentUpdateSchema = z.object({
  status: z.enum(PAYMENT_STATUS),
  paidAt: z.string().datetime().optional(),
  transactionRef: z.string().optional(),
});
