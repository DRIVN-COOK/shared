import type { ISODateString, DecimalString, CustomerOrderLine, Payment, Invoice } from '..';
import { Channel } from '../enums/Channel';
import { OrderStatus } from '../enums/OrderStatus';

export interface CustomerOrder {
  id: string;
  customerId: string;
  franchiseeId: string;
  truckId?: string | null;
  warehouseId?: string | null;
  channel: Channel;
  status: OrderStatus;
  scheduledPickupAt?: ISODateString | null;
  placedAt: ISODateString;
  totalHT: DecimalString;
  totalTVA: DecimalString;
  totalTTC: DecimalString;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  lines?: CustomerOrderLine[];
  payments?: Payment[];
  invoice?: Invoice | null;
}
