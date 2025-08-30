export const ROLE = ['USER','ADMIN','HQ_STAFF','FRANCHISE_OWNER','TRUCK_STAFF','CUSTOMER'] as const;
export type Role = typeof ROLE[number];

export const PO_STATUS = ['DRAFT','SUBMITTED','PREPARING','READY','DELIVERED','CANCELLED'] as const;
export type POStatus = typeof PO_STATUS[number];

export const TRUCK_STATUS = ['AVAILABLE','DEPLOYED','IN_MAINTENANCE','OUT_OF_SERVICE'] as const;
export type TruckStatus = typeof TRUCK_STATUS[number];

export const MAINTENANCE_TYPE = ['SERVICE','REPAIR','INSPECTION'] as const;
export const MAINTENANCE_STATUS = ['PLANNED','IN_PROGRESS','DONE'] as const;

export const ORDER_STATUS = ['PENDING','CONFIRMED','PREPARING','READY','FULFILLED','CANCELLED'] as const;
export const PAYMENT_PROVIDER = ['CARD','CASH','ONLINE'] as const;
export const PAYMENT_STATUS = ['PENDING','PAID','FAILED','REFUNDED'] as const;

export const CHANNEL = ['IN_PERSON','ONLINE_PREORDER'] as const;

export const LOYALTY_TIER = ['BASIC','SILVER','GOLD'] as const;
export const LOYALTY_TXN = ['EARN','SPEND','ADJUST'] as const;