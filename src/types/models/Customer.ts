import type { CustomerOrder, EventRegistration, ISODateString, LoyaltyCard, LoyaltyTransaction } from '..';

export interface Customer {
  id: string;
  userId: string;
  phone?: string | null;
  defaultCity?: string | null;
  defaultZip?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  loyaltyCard?: LoyaltyCard;
  orders?: CustomerOrder[];
  events?: EventRegistration[];
  loyaltyTxns?: LoyaltyTransaction[];
}
