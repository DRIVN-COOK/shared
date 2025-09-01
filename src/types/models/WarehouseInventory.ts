import type { ISODateString, DecimalString, Warehouse, Product } from '..';

export interface WarehouseInventory {
  id: string;
  warehouseId: string;
  productId: string;
  onHand: DecimalString;    // ex: '12.345'
  reserved: DecimalString;  // ex: '0.000'
  updatedAt: ISODateString;

  warehouse?: Warehouse;
  product?: Product;
}
