import type { ISODateString, DecimalString, CustomerOrder } from '..';
import { PaymentProvider } from '../enums/PaymentProvider';
import { PaymentStatus } from '../enums/PaymentStatus';

export interface Payment {
  id: string;
  customerOrderId: string;
  provider: PaymentProvider;
  amount: DecimalString;
  status: PaymentStatus;
  paidAt?: ISODateString | null;
  transactionRef?: string | null;
  createdAt: ISODateString;

  order?: CustomerOrder;
}
