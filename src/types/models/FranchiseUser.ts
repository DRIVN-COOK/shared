import type { Franchisee, User } from "..";

export interface FranchiseUser {
  id: string;
  userId: string;
  franchiseeId: string;
  roleInFranchise?: string | null; // OWNER | MANAGER | STAFF
  user?: User;
  franchisee?: Franchisee;
}
