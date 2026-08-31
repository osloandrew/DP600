import { describe, expect, it } from 'vitest';
import { evaluatePipeline, getQualitySummary } from './pipeline';

describe('transformation pipeline', () => {
  it('normalizes mixed date formats and records the date type', () => {
    const result = evaluatePipeline(['change-date-type']);
    expect(result.metadata.dateType).toBe('date');
    expect(result.rows.find((row) => row.orderId === 10482)?.orderDate).toBe('2026-08-03');
  });

  it('removes one duplicate business row', () => {
    const result = evaluatePipeline(['remove-duplicates']);
    expect(result.rows).toHaveLength(6);
    expect(getQualitySummary(result.rows).duplicates).toBe(0);
  });

  it('demonstrates that transform order changes derived results', () => {
    const derivedFirst = evaluatePipeline(['add-revenue', 'replace-null-quantity']);
    const repairedFirst = evaluatePipeline(['replace-null-quantity', 'add-revenue']);
    expect(derivedFirst.rows.find((row) => row.orderId === 10483)?.revenue).toBeNull();
    expect(repairedFirst.rows.find((row) => row.orderId === 10483)?.revenue).toBe(0);
  });

  it('lets a join preserve rows that an earlier incomplete-row filter removes', () => {
    const filterFirst = evaluatePipeline(['filter-incomplete', 'join-region']);
    const repairFirst = evaluatePipeline(['join-region', 'replace-null-quantity', 'filter-incomplete']);
    expect(filterFirst.rows).toHaveLength(3);
    expect(repairFirst.rows).toHaveLength(6);
  });
});
