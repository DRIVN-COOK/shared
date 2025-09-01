import type { Franchisee, ISODateString, TruckDeployment, TruckMaintenance } from '..';
import { TruckStatus } from '../enums/TruckStatus';

export interface Truck {
  id: string;
  franchiseeId: string;
  vin: string;
  plateNumber: string;
  model?: string | null;
  purchaseDate?: ISODateString | null;
  active: boolean;
  currentStatus: TruckStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  franchisee?: Franchisee;
  deployments?: TruckDeployment[];
  maintenances?: TruckMaintenance[];
}
