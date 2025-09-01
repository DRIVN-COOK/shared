import type { DecimalString, Product, PurchaseOrder } from '..';

export interface PurchaseOrderLine {
  id: string;
  purchaseOrderId: string;
  productId: string;
  qty: DecimalString;        // '12.345'
  unitPriceHT: DecimalString;
  tvaPct: DecimalString;
  isCoreItem: boolean;

  purchaseOrder?: PurchaseOrder;
  product?: Product;
}
