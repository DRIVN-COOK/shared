import type { ISODateString, User } from '..';

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  userAgent?: string | null;
  ip?: string | null;
  revokedAt?: ISODateString | null;
  createdAt: ISODateString;
  expiresAt: ISODateString;

  user?: User;
}
