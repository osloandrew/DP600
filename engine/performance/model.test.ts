import { describe, expect, it } from 'vitest';
import { evaluatePerformance } from './model';

describe('performance lab model', () => {
  it('starts at the documented deterministic baseline', () => {
    expect(evaluatePerformance([])).toEqual({ durationMs: 1840, rowsScanned: 12400000, modelMb: 1240, storageEngineMs: 1120, formulaEngineMs: 560, visualMs: 160, workRatio: 1 });
  });

  it('reduces formula-engine work when the iterator is simplified', () => {
    const result = evaluatePerformance(['simplify-iterator']);
    expect(result.formulaEngineMs).toBe(250);
    expect(result.storageEngineMs).toBe(1120);
  });

  it('redirects category queries to fewer rows with an aggregation', () => {
    const result = evaluatePerformance(['aggregation-table']);
    expect(result.rowsScanned).toBe(480000);
    expect(result.storageEngineMs).toBe(400);
    expect(result.modelMb).toBe(1274);
  });

  it('combines all interventions without randomness', () => {
    const ids = ['remove-tracking-id', 'simplify-iterator', 'aggregation-table', 'single-direction', 'category-grain', 'reduce-interactions'] as const;
    expect(evaluatePerformance([...ids])).toMatchObject({ durationMs: 425, storageEngineMs: 160, formulaEngineMs: 160, visualMs: 105, workRatio: 0.23 });
  });
});
