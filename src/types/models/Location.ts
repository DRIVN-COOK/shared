import type { ISODateString, TruckDeployment } from '..';

export interface Location {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  isRecurringSpot: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  deployments?: TruckDeployment[];
  events?: Event[];
}
