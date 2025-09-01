import type { ISODateString, DecimalString, Franchisee } from '..';

export interface RevenueShareReport {
  id: string;
  franchiseeId: string;
  period: string; // "YYYY-MM"
  grossSales: DecimalString;
  sharePct: DecimalString; // 0.0400
  amountDue: DecimalString;
  generatedPdfUrl?: string | null;
  createdAt: ISODateString;

  franchisee?: Franchisee;
}
