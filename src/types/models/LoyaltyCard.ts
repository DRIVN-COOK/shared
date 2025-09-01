import type { ISODateString, LoyaltyTransaction } from '..';
import { LoyaltyTier } from '../enums/LoyaltyTier';

export interface LoyaltyCard {
  id: string;
  customerId: string;
  cardNumber: string;
  points: number;
  tier: LoyaltyTier;
  printablePdfUrl?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  transactions?: LoyaltyTransaction[];
}
