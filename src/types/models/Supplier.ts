import type { ISODateString } from '..';

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
