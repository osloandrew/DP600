import { describe, expect, it } from 'vitest';
import { getQueryScenario, querySurfaceMeta, type QuerySurface, type QueryTask } from './rosetta';

describe('Query Rosetta registry', () => {
  it('provides every task for every surface', () => {
    for (const surface of Object.keys(querySurfaceMeta) as QuerySurface[]) {
      for (const task of ['filter', 'aggregate', 'group'] as QueryTask[]) expect(getQueryScenario(surface, task).code.length).toBeGreaterThan(10);
    }
  });

  it('keeps language purpose explicit', () => {
    expect(getQueryScenario('sql', 'group').location).toBe('Warehouse');
    expect(getQueryScenario('kql', 'group').purpose).toContain('telemetry');
    expect(getQueryScenario('dax', 'group').purpose).toContain('filter context');
    expect(getQueryScenario('visual', 'group').language).toBe('Generates T-SQL');
  });

  it('keeps relational and semantic-model totals aligned', () => {
    expect(getQueryScenario('sql', 'aggregate').result.value).toBe('$3,251');
    expect(getQueryScenario('dax', 'aggregate').result.value).toBe('$3,251');
    expect(getQueryScenario('visual', 'aggregate').result.value).toBe('$3,251');
  });
});
