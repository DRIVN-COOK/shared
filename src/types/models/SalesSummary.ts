import type { ISODateString, DecimalString, Franchisee } from '..';

export interface SalesSummary {
  id: string;
  franchiseeId: string;
  period: string; // "YYYY-MM" ou "YYYY-MM-DD"
  grossHT: DecimalString;
  grossTVA: DecimalString;
  grossTTC: DecimalString;
  ordersCount: number;
  createdAt: ISODateString;

  franchisee?: Franchisee;
}
