import type { Customer, ISODateString } from '..';
import { EventRegStatus } from '../enums/EventRegStatus';

export interface EventRegistration {
  id: string;
  eventId: string;
  customerId: string;
  status: EventRegStatus;
  registeredAt: ISODateString;

  event?: Event;
  customer?: Customer;
}
