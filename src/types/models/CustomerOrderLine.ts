import type { CustomerOrder, DecimalString, MenuItem } from '..';

export interface CustomerOrderLine {
  id: string;
  customerOrderId: string;
  menuItemId: string;
  qty: number;
  unitPriceHT: DecimalString;
  tvaPct: DecimalString;
  lineTotalHT: DecimalString;

  order?: CustomerOrder;
  menuItem?: MenuItem;
}
