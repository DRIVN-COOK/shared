import type { Franchisee, User, FranchiseRole } from "..";


export interface FranchiseUser {
  id: string;
  userId: string;
  franchiseeId: string;
  roleInFranchise?: FranchiseRole;
  user?: User;
  franchisee?: Franchisee;
}
