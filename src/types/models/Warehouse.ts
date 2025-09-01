import type { ISODateString, WarehouseInventory } from '..';

export interface Warehouse {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  hasKitchen: boolean;
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  inventories?: WarehouseInventory[];
}
