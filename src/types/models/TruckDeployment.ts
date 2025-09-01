import type { Franchisee, ISODateString, Truck } from '..';

export interface TruckDeployment {
  id: string;
  truckId: string;
  franchiseeId: string;
  locationId?: string | null;

  plannedStart: ISODateString;
  plannedEnd?: ISODateString | null;
  actualStart?: ISODateString | null;
  actualEnd?: ISODateString | null;
  notes?: string | null;

  createdAt: ISODateString;

  truck?: Truck;
  franchisee?: Franchisee;
  location?: Location | null;
}
