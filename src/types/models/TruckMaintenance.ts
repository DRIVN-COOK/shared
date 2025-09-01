import type { ISODateString, DecimalString, Truck } from '..';
import { MaintenanceStatus } from '../enums/MaintenanceStatus';
import { MaintenanceType } from '../enums/MaintenanceType';

export interface TruckMaintenance {
  id: string;
  truckId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledAt?: ISODateString | null;
  completedAt?: ISODateString | null;
  cost?: DecimalString | null;
  notes?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  truck?: Truck;
}
