import type { CustomerOrder, ISODateString } from '..';

export interface Invoice {
  id: string;
  customerOrderId: string;
  invoiceNumber: string;
  issuedAt: ISODateString;
  pdfUrl?: string | null;

  order?: CustomerOrder;
}
