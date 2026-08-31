import { describe, expect, it } from 'vitest';
import { evaluateScd } from './time-machine';

describe('SCD time machine', () => {
  it('overwrites history for Type 1', () => {
    const result = evaluateScd('type1', true);
    expect(result.versions).toHaveLength(1);
    expect(result.totals).toEqual({ Oslo: 0, Bergen: 2000 });
    expect(new Set(result.sales.map((sale) => sale.customerKey))).toEqual(new Set([1029]));
  });

  it('preserves history with surrogate-key versions for Type 2', () => {
    const result = evaluateScd('type2', true);
    expect(result.versions).toHaveLength(2);
    expect(result.totals).toEqual({ Oslo: 1200, Bergen: 800 });
    expect(result.versions.find((version) => version.current)?.customerKey).toBe(1884);
  });
});
