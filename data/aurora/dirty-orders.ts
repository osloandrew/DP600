export type DirtyOrder = {
  sourceRow: string;
  orderId: number;
  customer: string;
  storeId: 'OSL' | 'BER' | 'STO';
  region: string | null;
  quantity: number | null;
  unitPrice: number;
  orderDate: string | null;
  revenue?: number | null;
};

// Each anomaly exists to support a visible transformation: duplicate rows,
// nulls, mixed date formats, a missing date, and a region recoverable by join.
export const dirtyOrders: DirtyOrder[] = [
  { sourceRow: 'r1', orderId: 10481, customer: 'Ava', storeId: 'OSL', region: 'North', quantity: 2, unitPrice: 499, orderDate: '2026-08-02' },
  { sourceRow: 'r2', orderId: 10482, customer: 'Ben', storeId: 'BER', region: null, quantity: 1, unitPrice: 899, orderDate: '03/08/26' },
  { sourceRow: 'r3', orderId: 10482, customer: 'Ben', storeId: 'BER', region: null, quantity: 1, unitPrice: 899, orderDate: '03/08/26' },
  { sourceRow: 'r4', orderId: 10483, customer: 'Chen', storeId: 'STO', region: 'South', quantity: null, unitPrice: 199, orderDate: '2026-08-03' },
  { sourceRow: 'r5', orderId: 10484, customer: 'Dia', storeId: 'OSL', region: 'North', quantity: 3, unitPrice: 149, orderDate: '04/08/26' },
  { sourceRow: 'r6', orderId: 10485, customer: 'Elias', storeId: 'STO', region: 'South', quantity: 2, unitPrice: 329, orderDate: '2026-08-05' },
  { sourceRow: 'r7', orderId: 10486, customer: 'Fatima', storeId: 'BER', region: null, quantity: 1, unitPrice: 249, orderDate: null },
];

export const storeRegions: Record<DirtyOrder['storeId'], string> = { OSL: 'North', BER: 'West', STO: 'South' };
