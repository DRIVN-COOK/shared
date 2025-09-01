import type { ISODateString, User } from '..';

export interface AuditLog {
  id: string;
  actorUserId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  payload?: unknown | null; // JSON arbitraire
  createdAt: ISODateString;

  actor?: User | null;
}
