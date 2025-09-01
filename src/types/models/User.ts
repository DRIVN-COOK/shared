import type { Customer, FranchiseUser, ISODateString } from '..';
import { Role } from '../enums/Role';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  // relations optionnelles
  customer?: Customer;
  franchiseUsers?: FranchiseUser[];
}
