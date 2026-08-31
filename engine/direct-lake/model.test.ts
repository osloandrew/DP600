import { describe, expect, it } from 'vitest';
import { initialDirectLakeState, reduceDirectLake } from './model';

describe('Direct Lake engine', () => {
  it('loads only required columns and reuses them on a repeated query', () => {
    const first = reduceDirectLake(initialDirectLakeState, { type: 'run-query', query: 'sales-by-category' });
    expect(first.loadedColumns).toHaveLength(4);
    expect(first.loadedColumns).toContain('FactSales.Revenue');
    const second = reduceDirectLake(first, { type: 'run-query', query: 'sales-by-category' });
    expect(second.newlyLoadedColumns).toEqual([]);
  });

  it('loads only the additional columns needed by a second query', () => {
    const first = reduceDirectLake(initialDirectLakeState, { type: 'run-query', query: 'sales-by-category' });
    const second = reduceDirectLake(first, { type: 'run-query', query: 'sales-by-region' });
    expect(second.newlyLoadedColumns).toEqual(['FactSales.RegionKey', 'DimRegion.RegionKey', 'DimRegion.Region']);
  });

  it('keeps changed data outside the frame until refresh', () => {
    const changed = reduceDirectLake(initialDirectLakeState, { type: 'change-data' });
    expect(changed.dataVersion).toBe(2);
    expect(changed.framedVersion).toBe(1);
    const refreshed = reduceDirectLake(changed, { type: 'refresh-frame' });
    expect(refreshed.framedVersion).toBe(2);
  });

  it('preserves unchanged dimension columns when the changed fact table is framed', () => {
    let state = reduceDirectLake(initialDirectLakeState, { type: 'run-query', query: 'sales-by-category' });
    state = reduceDirectLake(state, { type: 'change-data' });
    state = reduceDirectLake(state, { type: 'refresh-frame' });
    expect(state.loadedColumns).toEqual(['DimProduct.ProductKey', 'DimProduct.Category']);
  });

  it('allows fallback only for the SQL endpoint variant', () => {
    const unchanged = reduceDirectLake(initialDirectLakeState, { type: 'toggle-fallback-condition' });
    expect(unchanged.fallbackCondition).toBe(false);
    let sql = reduceDirectLake(initialDirectLakeState, { type: 'set-mode', mode: 'sql-endpoint' });
    sql = reduceDirectLake(sql, { type: 'toggle-fallback-condition' });
    sql = reduceDirectLake(sql, { type: 'run-query', query: 'sales-by-category' });
    expect(sql.servingPath).toBe('direct-query');
    expect(sql.loadedColumns).toEqual([]);
  });
});
