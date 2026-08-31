import { describe, expect, it } from 'vitest';
import { evaluateIncrementalRefresh } from './model';

const base = { storeMonths: 12, refreshDays: 7, realtime: false } as const;

describe('incremental refresh policy', () => {
  it('processes only the refresh partition on a subsequent refresh', () => {
    const result = evaluateIncrementalRefresh(base, '2026-08-31', false, true);
    expect(result.partitions.filter((partition) => partition.processed).map((partition) => partition.kind)).toEqual(['refresh']);
  });

  it('does not pick up a late change outside a seven-day window', () => {
    const result = evaluateIncrementalRefresh(base, '2026-08-31', true, true);
    expect(result.lateChangeCovered).toBe(false);
    expect(result.visibleRevenue).toBe(1000);
  });

  it('picks up the same late change when the window expands', () => {
    const result = evaluateIncrementalRefresh({ ...base, refreshDays: 30 }, '2026-08-31', true, true);
    expect(result.lateChangeCovered).toBe(true);
    expect(result.visibleRevenue).toBe(1250);
  });

  it('adds an optional DirectQuery partition beyond the refresh period', () => {
    const result = evaluateIncrementalRefresh({ ...base, realtime: true }, '2026-08-31', false, false);
    expect(result.partitions.at(-1)?.kind).toBe('realtime');
  });

  it('shows contiguous non-overlapping historical bands', () => {
    const result = evaluateIncrementalRefresh(base, '2026-08-31', false, false);
    expect(result.partitions.slice(0, 3).map((partition) => partition.range)).toEqual([
      '2025-08-01 → 2026-08-01',
      '2026-08-01 → 2026-08-24',
      '2026-08-24 → 2026-08-31',
    ]);
  });
});
