import type { ISODateString, DecimalString, Franchisee } from '..';

export interface FranchiseAgreement {
  id: string;
  franchiseeId: string;
  startDate: ISODateString;
  endDate?: ISODateString | null;
  entryFeeAmount: DecimalString;  // 50000.00
  revenueSharePct: DecimalString; // 0.0400
  notes?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  franchisee?: Franchisee;
}
