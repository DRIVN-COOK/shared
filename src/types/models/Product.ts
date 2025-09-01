import type { ISODateString, ProductPrice } from '..';
import { ProductType } from '../enums/ProductType';
import { Unit } from '../enums/Unit';

export interface Product {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  unit: Unit;
  isCoreStock: boolean;
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  prices?: ProductPrice[];
}
