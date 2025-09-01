import type { ISODateString, DecimalString, Product } from '..';

export interface MenuItem {
  id: string;
  productId?: string | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  priceHT: DecimalString;
  tvaPct: DecimalString;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  product?: Product | null;
}
