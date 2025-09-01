import type { CustomerOrder, FranchiseAgreement, FranchiseUser, ISODateString, PurchaseOrder, RevenueShareReport, SalesSummary, Truck, TruckDeployment } from '..';

export interface Franchisee {
  id: string;
  name: string;
  siren: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  billingAddress?: string | null;
  joinDate?: ISODateString | null;
  active: boolean;
  defaultWarehouseId?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  agreements?: FranchiseAgreement[];
  franchiseUsers?: FranchiseUser[];
  trucks?: Truck[];
  purchaseOrders?: PurchaseOrder[];
  customerOrders?: CustomerOrder[];
  events?: Event[];
  revenueReports?: RevenueShareReport[];
  deployments?: TruckDeployment[];
  salesSummaries?: SalesSummary[];
}
