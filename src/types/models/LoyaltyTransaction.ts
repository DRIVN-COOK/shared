import type { Customer, ISODateString, LoyaltyCard } from '..';
import { LoyaltyTxnType } from '../enums/LoyaltyTxnType';

export interface LoyaltyTransaction {
  id: string;
  loyaltyCardId: string;
  type: LoyaltyTxnType;
  points: number;
  createdAt: ISODateString;

  customerId?: string | null;
  refType?: string | null;
  refId?: string | null;

  loyaltyCard?: LoyaltyCard;
  customer?: Customer | null;
}
