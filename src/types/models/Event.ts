import type { EventRegistration, Franchisee, ISODateString } from '..';

export interface Event {
  id: string;
  franchiseeId: string;
  title: string;
  description?: string | null;
  startAt: ISODateString;
  endAt?: ISODateString | null;
  locationId?: string | null;
  isPublic: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  franchisee?: Franchisee;
  location?: Location | null;
  registrations?: EventRegistration[];
}
