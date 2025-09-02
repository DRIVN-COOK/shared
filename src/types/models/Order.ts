// shared/src/types/order.ts
import type { ISODateString, DecimalString, Franchisee } from '..';
import { OrderStatus } from './../enums/OrderStatus'; // ✅ source unique

export type OrderChannel = 'IN_PERSON' | 'ONLINE_PREORDER';

export interface OrderLine {
  id: string;
  menuItemId: string;
  qty: number;
  unitPriceHT: DecimalString;
  tvaPct: DecimalString;
  lineTotalHT: DecimalString;
}

export interface Order {
  id: string;
  customerId: string;
  franchiseeId: string;
  truckId?: string | null;
  warehouseId?: string | null;

  channel: OrderChannel;
  status: OrderStatus;
  scheduledPickupAt?: ISODateString | null;
  placedAt: ISODateString;

  totalHT: DecimalString;
  totalTVA: DecimalString;
  totalTTC: DecimalString;

  createdAt: ISODateString;
  updatedAt: ISODateString;

  lines?: OrderLine[];
  invoice?: { pdfUrl?: string | null } | null;

  franchisee?: Franchisee;
}

export interface OrderListItem {
  id: string;
  placedAt: ISODateString;
  status: OrderStatus;
  totalHT: DecimalString;
  totalTVA: DecimalString;
  totalTTC: DecimalString;
}

export interface NewOrderLineInput {
  menuItemId: string;
  qty: number;
  unitPriceHT: DecimalString;
  tvaPct: DecimalString;
}

export interface NewOrderRequest {
  channel: OrderChannel;
  truckId?: string;
  warehouseId?: string;
  lines: NewOrderLineInput[];
}
