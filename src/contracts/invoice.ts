import { z } from 'zod';
import { idSchema } from './common';

export const invoiceIssueSchema = z.object({
  customerOrderId: idSchema,
});
