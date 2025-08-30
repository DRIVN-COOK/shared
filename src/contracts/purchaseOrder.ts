import { z } from 'zod';
import { idSchema, moneyStringSchema, decimalQtySchema } from './common';

export const purchaseOrderLineCreateSchema = z.object({
  productId: idSchema,
  qty: decimalQtySchema,         // "1" | "1.250"
  unitPriceHT: moneyStringSchema, // "12.50"
  tvaPct: z.string(),            // "5.50"
  isCoreItem: z.boolean(),       // true = stock “maison” (compte dans les 80%)
});

export const purchaseOrderCreateSchema = z.object({
  franchiseeId: idSchema,
  warehouseId: idSchema,
  lines: z.array(purchaseOrderLineCreateSchema).min(1),
});

export type PurchaseOrderCreate = z.infer<typeof purchaseOrderCreateSchema>;
export type PurchaseOrderLineCreate = z.infer<typeof purchaseOrderLineCreateSchema>;

/** Helpers de calcul 80/20 (côté UI) */
export function toNumber(x: string): number { return Number.parseFloat(x.replace(',', '.')); }

export function lineAmountHT(line: PurchaseOrderLineCreate): number {
  return toNumber(line.qty) * toNumber(line.unitPriceHT);
}

export function computeRatios(lines: PurchaseOrderLineCreate[]) {
  const totals = lines.reduce((acc, l) => {
    const amt = lineAmountHT(l);
    if (l.isCoreItem) acc.core += amt; else acc.free += amt;
    return acc;
  }, { core: 0, free: 0 });

  const total = totals.core + totals.free;
  const corePct = total > 0 ? (totals.core / total) * 100 : 0;
  const freePct = 100 - corePct;
  return { coreHT: totals.core, freeHT: totals.free, totalHT: total, corePct, freePct };
}
