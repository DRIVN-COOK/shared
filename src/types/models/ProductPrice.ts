import type { ISODateString, DecimalString, Product } from '..';

export interface ProductPrice {
  id: string;
  productId: string;
  validFrom: ISODateString;
  validTo?: ISODateString | null;
  priceHT: DecimalString;
  tvaPct: DecimalString;
  createdAt: ISODateString;

  product?: Product;
}
