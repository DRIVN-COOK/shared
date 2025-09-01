export * from './models';
export * from './enums';

export type ISODateString = string;
export type DecimalString = string;

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
