export type ScdMode = 'type1' | 'type2';
export type DimensionVersion = { customerKey: number; customerId: number; name: string; city: string; validFrom: string; validTo: string; current: boolean; state: 'unchanged' | 'overwritten' | 'expired' | 'inserted' };
export type HistoricalSale = { orderId: number; date: string; revenue: number; customerKey: number; city: string };

export function evaluateScd(mode: ScdMode, changeApplied: boolean) {
  if (!changeApplied) return {
    versions: [{ customerKey: 1029, customerId: 812, name: 'Ava Nilsen', city: 'Oslo', validFrom: '2025-01-01', validTo: '—', current: true, state: 'unchanged' }] as DimensionVersion[],
    sales: [{ orderId: 10401, date: '2026-02-14', revenue: 1200, customerKey: 1029, city: 'Oslo' }] as HistoricalSale[],
    totals: { Oslo: 1200, Bergen: 0 },
    explanation: 'The customer has one current dimension row. The June source change has not been processed yet.',
  };
  if (mode === 'type1') return {
    versions: [{ customerKey: 1029, customerId: 812, name: 'Ava Nilsen', city: 'Bergen', validFrom: '2025-01-01', validTo: '—', current: true, state: 'overwritten' }] as DimensionVersion[],
    sales: [
      { orderId: 10401, date: '2026-02-14', revenue: 1200, customerKey: 1029, city: 'Bergen' },
      { orderId: 10592, date: '2026-07-08', revenue: 800, customerKey: 1029, city: 'Bergen' },
    ] as HistoricalSale[], totals: { Oslo: 0, Bergen: 2000 },
    explanation: 'The existing city value was overwritten. Both historical and new facts now resolve through the same customer key to Bergen.',
  };
  return {
    versions: [
      { customerKey: 1029, customerId: 812, name: 'Ava Nilsen', city: 'Oslo', validFrom: '2025-01-01', validTo: '2026-05-31', current: false, state: 'expired' },
      { customerKey: 1884, customerId: 812, name: 'Ava Nilsen', city: 'Bergen', validFrom: '2026-06-01', validTo: '—', current: true, state: 'inserted' },
    ] as DimensionVersion[],
    sales: [
      { orderId: 10401, date: '2026-02-14', revenue: 1200, customerKey: 1029, city: 'Oslo' },
      { orderId: 10592, date: '2026-07-08', revenue: 800, customerKey: 1884, city: 'Bergen' },
    ] as HistoricalSale[], totals: { Oslo: 1200, Bergen: 800 },
    explanation: 'The old version was expired and a new surrogate key was inserted. Each fact keeps the customer version valid on its transaction date.',
  };
}

export const scdAccuracyNote = 'This conceptual simulation shows warehouse versioning and time-based key assignment; it does not execute a Dataflow Gen2 or warehouse load.';
