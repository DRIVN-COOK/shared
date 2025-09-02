import type { ISODateString, DecimalString } from '..';

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  priceHT: DecimalString;
  tvaPct: DecimalString;
  imageUrl?: string | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
