import type { ISODateString, DecimalString, Warehouse, Product } from '..';
import { StockMoveType } from '../enums/StockMoveType';

export interface StockMovement {
  id: string;
  warehouseId: string;
  productId: string;
  qty: DecimalString;
  type: StockMoveType;
  refType?: string | null;
  refId?: string | null;
  createdAt: ISODateString;

  warehouse?: Warehouse;
  product?: Product;
}
