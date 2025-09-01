import type { ISODateString, DecimalString, PurchaseOrderLine } from '..';
import { POStatus } from '../enums/POStatus';

export interface PurchaseOrder {
  id: string;
  franchiseeId: string;
  warehouseId: string;
  orderedAt: ISODateString;
  status: POStatus;

  corePct?: DecimalString | null;
  freePct?: DecimalString | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;

  lines?: PurchaseOrderLine[];
}
